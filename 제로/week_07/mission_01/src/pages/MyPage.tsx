import { useEffect, useState } from "react";

import { getMyInfo } from "../apis/auth";

import type {ResponseMyInfoDto} from "../types/auth";

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import usePatchMyInfo from "../hooks/mutations/usePatchMyInfo";

import { uploadImage } from "../apis/lp";



export const MyPage = () => {
  const navigate = useNavigate();

  const { logout, setUser } = useAuth();

  const [data, setData] =
    useState<ResponseMyInfoDto | null>(
      null
    );

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [name, setName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [avatar, setAvatar] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [isAvatarRemoved, setIsAvatarRemoved] = useState(false);





  const {
    mutate: patchMyInfoMutate,
    isPending,
  } = usePatchMyInfo(
    () => setIsEditOpen(false)
  );



  useEffect(() => {
    const getData = async () => {
      try {
        const response =
          await getMyInfo();

        setData(response);

      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);



  const handleLogout = async () => {
    await logout();

    navigate("/");
  };



  const openEditModal = () => {
    setName(data?.data?.name ?? "");

    setBio(data?.data?.bio ?? "");

    setPreview(
      data?.data?.avatar ?? ""
    );

    setIsEditOpen(true);
  };



  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setAvatar(file);

    setPreview(
      URL.createObjectURL(file)
    );
    setIsAvatarRemoved(false);
  };



  const handleSave = async () => {
  try {
    let avatarUrl =
      data?.data?.avatar ?? "";

    if (isAvatarRemoved) {
      avatarUrl = "";
    }

    if (avatar) {
      const uploadResponse =
        await uploadImage(avatar);

      avatarUrl =
        uploadResponse.data.imageUrl;
    }

    patchMyInfoMutate(
      {
        name,
        bio,
        avatar: avatarUrl,
      },
      {
        onSuccess: () => {

          setData((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              data: {
                ...prev.data,
                name,
                bio,
                avatar: avatarUrl,
              },
            };
          });

          setUser({
            id: data.data.id,
            name,
            avatar: avatarUrl,
          });

          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.data.id,
              name,
              avatar: avatarUrl,
            })
          );

          setIsEditOpen(false);
        },
      }
    );

  } catch (error) {
    console.error(error);

    alert("수정 실패");
  }
};



  if (!data) {
    return (
      <div
        className="
          flex items-center justify-center
          h-full bg-black text-white
        "
      >
        Loading...
      </div>
    );
  }



  return (
    <>
      <div
        className="
          flex flex-col items-center
          justify-center
          h-full text-white
          gap-4
        "
      >

        <h1 className="text-3xl font-bold">
          {data.data?.name}님 환영합니다.
        </h1>

        {data.data?.avatar ? (
          <img
            src={data.data.avatar}
            alt="프로필"
            className="
              w-40 h-40
              rounded-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              w-40 h-40
              rounded-full
              bg-gray-700
              flex items-center
              justify-center
              text-gray-300
            "
          >
            No Image
          </div>
        )}

        <p>{data.data?.email}</p>

        <p className="text-gray-400">
          {data.data?.bio}
        </p>

        <div className="flex gap-3">

          <button
            onClick={openEditModal}
            className="
              bg-pink-500
              px-5 py-3
              rounded-lg
              hover:bg-pink-600
            "
          >
            설정
          </button>

          <button
            className="
              bg-black/80
              text-white
              rounded-lg
              px-5 py-3
            "
            onClick={handleLogout}
          >
            로그아웃
          </button>

        </div>
      </div>



      {/* 수정 모달 */}
      {isEditOpen && (
        <div
          className="
            fixed inset-0
            bg-black/70
            flex items-center justify-center
            text-white
            z-50
          "
          onClick={() =>
            setIsEditOpen(false)
          }
        >

          <div
            className="
              bg-[#181818]
              p-8
              rounded-2xl
              w-[400px]
              flex flex-col gap-4
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex justify-between">

              <h2 className="text-xl font-bold text-center w-full">
                프로필 수정
              </h2>

              <button
                onClick={() =>
                  setIsEditOpen(false)
                }
              >
                ✕
              </button>

            </div>

            {/* 프로필 사진 */}
            <div className="flex flex-col gap-2">

              <div className="relative self-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="
                      w-24 h-24
                      rounded-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      w-24 h-24
                      rounded-full
                      bg-gray-700
                      flex items-center
                      justify-center
                      text-sm text-gray-300
                    "
                  >
                    No Image
                  </div>
                )}

                {preview && (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar(null);
                      setPreview("");
                      setIsAvatarRemoved(true);
                    }}
                    className="
                      absolute
                      -top-2 -right-2
                      w-6 h-6
                      rounded-full
                      bg-red-500
                      text-white
                      text-sm
                    "
                  >
                    ✕
                  </button>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />
            </div>

            {/* 이름 */}
            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="이름"
              className="
                bg-black
                border border-gray-700
                rounded-lg
                px-4 py-3
              "
            />

            {/* bio */}
            <textarea
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              placeholder="bio"
              className="
                bg-black
                border border-gray-700
                rounded-lg
                px-4 py-3
                resize-none
                h-28
              "
            />

            <button
              onClick={handleSave}
              disabled={isPending}
              className="
                bg-pink-500
                hover:bg-pink-600
                py-3 rounded-lg
                font-semibold
              "
            >
              저장
            </button>

          </div>
        </div>
      )}
    </>
  );
};