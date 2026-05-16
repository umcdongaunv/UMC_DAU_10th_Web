import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";


import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";

import { PAGINATION_ORDER } from "../enums/common";

import LpCard from "../components/LpCard/LpCard";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
import usePostLp from "../hooks/mutations/usePostLp";
import { uploadImage } from "../apis/uploads";


const HomePage = () => {

  const [sort, setSort] =
    useState<PAGINATION_ORDER>(
      PAGINATION_ORDER.desc
    );

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [content, setContent] =
    useState("");

  const [tagInput, setTagInput] =
    useState("");

  const [tags, setTags] = useState<
    string[]
  >([]);

  const resetForm = () => {
  setTitle("");
  setContent("");
  setTags([]);
  setTagInput("");
  setThumbnail(null);
  setPreview(null);
};

  const {
  mutate,
  isPending: isPosting,
} = usePostLp({
  onClose: () => setIsModalOpen(false),
  resetForm,
});

  const [thumbnail, setThumbnail] =
    useState<File | null>(null);

  const [preview, setPreview] =
  useState<string | null>(null);

  const {
    data,
    isFetching,
    hasNextPage,
    isPending,
    isError,
    fetchNextPage,
  } = useGetInfiniteLpList(20, "", sort);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [
    inView,
    isFetching,
    hasNextPage,
    fetchNextPage,
  ]);

  const lps =
    data?.pages.flatMap(
      (page) => page.data.data
    ) ?? [];



  // 태그 추가
  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    if (tags.includes(tagInput.trim())) {
      return;
    }

    setTags((prev) => [
      ...prev,
      tagInput.trim(),
    ]);

    setTagInput("");
  };

  // 태그 삭제
  const handleDeleteTag = (
    deleteTag: string
  ) => {
    setTags((prev) =>
      prev.filter(
        (tag) => tag !== deleteTag
      )
    );
  };

  // LP 등록
const handleSubmit = async () => {
  try {
    let imageUrl = "";

    // 이미지 업로드
    if (thumbnail) {
      const uploadResponse =
        await uploadImage(thumbnail);

      imageUrl =
        uploadResponse.data.imageUrl;
    }

    mutate({
      title,
      content,
      thumbnail: imageUrl,
      tags,
      published: true,
    });

  } catch (error) {
    console.error(error);

    alert("업로드 실패");
  }
};


  return (
    <div className="bg-black min-h-screen text-white p-10">

      {/* 정렬 */}
      <div className="flex gap-3 mb-10">
        <button
          onClick={() =>
            setSort(PAGINATION_ORDER.desc)
          }
          className={`px-4 py-2 rounded ${
            sort === PAGINATION_ORDER.desc
              ? "bg-pink-500"
              : "bg-gray-700"
          }`}
        >
          최신순
        </button>

        <button
          onClick={() =>
            setSort(PAGINATION_ORDER.asc)
          }
          className={`px-4 py-2 rounded ${
            sort === PAGINATION_ORDER.asc
              ? "bg-pink-500"
              : "bg-gray-700"
          }`}
        >
          오래된순
        </button>
      </div>

      {/* 초기 로딩 */}
      {isPending && (
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <LpCardSkeleton key={index} />
            )
          )}
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <p className="text-red-400">
          데이터를 불러오지 못했습니다.
        </p>
      )}

      {/* 목록 */}
      {!isPending && !isError && (
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {lps.map((lp) => (
            <LpCard
              key={lp.id}
              lp={lp}
            />
          ))}
        </div>
      )}

      {/* infinite scroll trigger */}
      <div
        ref={ref}
        className="h-10 mt-6"
      />

      {/* 추가 로딩 */}
      {isFetching && !isPending && (
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
            mt-6
          "
        >
          {Array.from({ length: 4 }).map(
            (_, index) => (
              <LpCardSkeleton key={index} />
            )
          )}
        </div>
      )}

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          fixed
          bottom-8
          right-8
          w-16
          h-16
          rounded-full
          bg-pink-500
          text-white
          text-4xl
          shadow-2xl
          hover:scale-110
          hover:bg-pink-600
          transition-all
          duration-300
          flex
          items-center
          justify-center
          z-50
        "
      >
        +
      </button>

      {/* 모달 */}
      {isModalOpen && (
        <>
          {/* 배경 */}
          <div
            className="
              fixed inset-0
              bg-black/60
              backdrop-blur-sm
              z-40
            "
            onClick={() =>
              setIsModalOpen(false)
            }
          />

          {/* 모달 */}
          <div
            className="
              fixed
              top-1/2 left-1/2
              -translate-x-1/2
              -translate-y-1/2
              w-[90%]
              max-w-[520px]
              bg-[#1f1f2e]
              rounded-3xl
              p-8
              z-50
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* 닫기 */}
            <button
              onClick={() =>
                setIsModalOpen(false)
              }
              className="
                absolute
                top-4 right-5
                text-white
                text-3xl
              "
            >
              ×
            </button>

            {/* 파일 업로드 */}
            <div className="mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setThumbnail(file);

                  const imageUrl =
                    URL.createObjectURL(file);

                  setPreview(imageUrl);
                }
              }}
                className="
                  w-full
                  text-sm
                  text-gray-300
                "
              />
            </div>

            {preview && (
            <div className="flex justify-center mb-6">
              <img
                src={preview}
                alt="preview"
                className="
                  w-52
                  h-52
                  object-cover
                  rounded-2xl
                  border border-gray-700
                "
              />
            </div>
          )}

            {/* 입력 */}
            <div className="flex flex-col gap-4">

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="LP Name"
                className="
                  bg-transparent
                  border border-gray-600
                  rounded-xl
                  px-4 py-3
                  text-white
                "
              />

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
                placeholder="LP Content"
                rows={4}
                className="
                  bg-transparent
                  border border-gray-600
                  rounded-xl
                  px-4 py-3
                  text-white
                  resize-none
                "
              />

              {/* 태그 */}
              <div className="flex gap-3">
                <input
                  value={tagInput}
                  onChange={(e) =>
                    setTagInput(
                      e.target.value
                    )
                  }
                  placeholder="LP Tag"
                  className="
                    flex-1
                    bg-transparent
                    border border-gray-600
                    rounded-xl
                    px-4 py-3
                    text-white
                  "
                />

                <button
                  onClick={handleAddTag}
                  className="
                    px-6
                    rounded-xl
                    bg-gray-300
                    text-gray-800
                    font-semibold
                  "
                >
                  Add
                </button>
              </div>

              {/* 태그 목록 */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="
                      flex items-center gap-2
                      bg-pink-500
                      px-3 py-1
                      rounded-full
                      text-sm
                    "
                  >
                    <span>{tag}</span>

                    <button
                      onClick={() =>
                        handleDeleteTag(
                          tag
                        )
                      }
                      className="
                        text-white
                        hover:text-black
                      "
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* 등록 */}
              <button
                onClick={handleSubmit}
                disabled={isPosting}
                className="
                  mt-4
                  py-4
                  rounded-xl
                  bg-pink-500
                  text-white
                  text-xl
                  font-semibold
                  hover:bg-pink-600
                  transition-colors
                  disabled:opacity-50
                "
              >
                {isPosting
                  ? "등록 중..."
                  : "Add LP"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;