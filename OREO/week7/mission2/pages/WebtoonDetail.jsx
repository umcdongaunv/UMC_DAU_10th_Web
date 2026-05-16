import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchWebtoon, deleteWebtoon, toggleWebtoonLike } from '../api/webtoons.js'
import { qk } from '../lib/queryKeys.js'
import { useAuth } from '../auth/AuthContext.jsx'
import CommentSection from '../components/CommentSection.jsx'
import { SkeletonCard } from '../components/Skeleton.jsx'
import LpWriteModal from '../components/LpWriteModal.jsx'
import ConfirmModal from '../components/ConfirmModal.jsx'

export default function WebtoonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user } = useAuth()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: qk.webtoons.detail(id),
    queryFn: () => fetchWebtoon(id),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(id),
  })

  const deleteMut = useMutation({
    mutationFn: () => deleteWebtoon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.webtoons.lists() })
      qc.removeQueries({ queryKey: qk.webtoons.detail(id) })
      navigate('/webtoons', { replace: true })
    },
  })

  // ⭐ 좋아요 낙관적 업데이트 (mission 2의 핵심)
  // 사용자가 하트를 누르는 즉시 화면이 바뀌어야 함. 서버 응답(700ms)을 기다리지 않는다.
  // 흐름: onMutate → (mutate) → onError(롤백) → onSettled(서버와 최종 동기화)
  const likeMut = useMutation({
    mutationFn: () => toggleWebtoonLike(id),
    // 중복 클릭/경쟁 상태 방지: mutationKey로 같은 글에 대한 mutation을 묶음.
    mutationKey: ['toggleLike', Number(id)],
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.webtoons.detail(id) })
      const prevDetail = qc.getQueryData(qk.webtoons.detail(id))
      qc.setQueryData(qk.webtoons.detail(id), (prev) => {
        if (!prev) return prev
        const liked = !prev.liked
        const delta = liked ? 1 : -1
        return { ...prev, liked, likes: Math.max(0, prev.likes + delta) }
      })
      return { prevDetail }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevDetail !== undefined) {
        qc.setQueryData(qk.webtoons.detail(id), ctx.prevDetail)
      }
    },
    onSuccess: (next) => {
      qc.setQueryData(qk.webtoons.detail(id), (prev) =>
        prev ? { ...prev, liked: next.liked, likes: next.likes } : prev,
      )
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: qk.webtoons.lists() })
    },
  })

  const isOwner = user && data && user.id === data.authorId

  return (
    <section className="page detail-page">
      <button className="btn ghost small back-btn" onClick={() => navigate(-1)}>
        ← 뒤로
      </button>

      {isPending && <DetailSkeleton />}

      {isError && (
        <div className="centered">
          <p>오류: {error?.message ?? '데이터를 불러오지 못했어요.'}</p>
          <button className="btn small" onClick={() => refetch()}>
            다시 시도
          </button>
        </div>
      )}

      {data && (
        <article className="detail">
          <div className="detail-hero">
            <img src={data.thumbnail} alt={data.title} className="detail-thumb" />
            <div className="detail-meta">
              <h1>{data.title}</h1>
              <p className="muted">{data.author}</p>
              <p className="muted">
                {new Date(data.createdAt).toLocaleDateString()} · ❤️ {data.likes}
              </p>
              {Array.isArray(data.tags) && data.tags.length > 0 && (
                <ul className="tag-chip-list" style={{ marginTop: 8 }}>
                  {data.tags.map((t) => (
                    <li key={t} className="tag-chip readonly">
                      <span>#{t}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="detail-actions">
                <button
                  className={`btn small ${data.liked ? 'primary' : ''}`}
                  onClick={() => {
                    if (!user) {
                      alert('로그인 후 좋아요를 누를 수 있어요.')
                      return
                    }
                    likeMut.mutate()
                  }}
                  // 낙관적 업데이트라서 isPending에도 disabled 하지 않음 — 사용자는 즉시 다시 토글 가능.
                >
                  {data.liked ? '💖 좋아요 취소' : '🤍 좋아요'}
                </button>
                {isOwner && (
                  <>
                    <button
                      className="btn ghost small"
                      onClick={() => setEditOpen(true)}
                    >
                      수정
                    </button>
                    <button
                      className="btn ghost small danger"
                      onClick={() => setConfirmDelete(true)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <section className="detail-body">
            <p className="lead">{data.description}</p>
            <p>{data.body}</p>
          </section>

          <CommentSection webtoonId={id} />
        </article>
      )}

      {/* 본인 글일 때만 수정 모달 */}
      {data && (
        <LpWriteModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          mode="edit"
          initial={data}
        />
      )}

      <ConfirmModal
        open={confirmDelete}
        onClose={() => !deleteMut.isPending && setConfirmDelete(false)}
        onConfirm={() => deleteMut.mutate()}
        title="이 LP를 삭제할까요?"
        message="삭제하면 댓글까지 함께 사라져요."
        confirmText="삭제"
        confirmDanger
        pending={deleteMut.isPending}
      />
    </section>
  )
}

function DetailSkeleton() {
  return (
    <div className="detail">
      <div className="detail-hero">
        <div className="detail-thumb skeleton-shimmer" />
        <div className="detail-meta">
          <div className="skeleton-line skeleton-shimmer" style={{ width: '60%', height: 24 }} />
          <div className="skeleton-line skeleton-shimmer" style={{ width: '30%', height: 14, marginTop: 10 }} />
          <div className="skeleton-line skeleton-shimmer" style={{ width: '40%', height: 14, marginTop: 6 }} />
        </div>
      </div>
      <div className="detail-body">
        <div className="skeleton-line skeleton-shimmer" style={{ width: '90%', height: 14 }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '70%', height: 14, marginTop: 8 }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '85%', height: 14, marginTop: 8 }} />
      </div>
      <SkeletonCard />
    </div>
  )
}
