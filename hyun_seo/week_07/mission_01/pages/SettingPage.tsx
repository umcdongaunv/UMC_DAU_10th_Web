import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Check, Loader2, User } from "lucide-react";
import { axiosInstance } from "../apis/axios";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { Loading } from "../components/Loading";

export const SettingPage = () => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: me, isPending } = useGetMyInfo(accessToken);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (me?.data) {
      setName(me.data.name);
      setBio(me.data.bio || "");
      setImagePreview(me.data.avatar);
    }
  }, [me]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload: { name: string; bio: string; imageFile?: File | null }) => {
      if (payload.imageFile) {
        const formData = new FormData();
        formData.append("name", payload.name);
        formData.append("bio", payload.bio);
        formData.append("avatar", payload.imageFile);

        const {data} = await axiosInstance.patch("/v1/users", formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });
      return data;
      } else {
        const {data} = await axiosInstance.patch("/v1/users", {
          name: payload.name,
          bio: payload.bio,
        });
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      alert("프로필이 성공적으로 수정되었습니다! ✨");
    },
    onError: () => {
      alert("수정 중 오류가 발생했습니다.");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return alert("이름은 필수 입력 항목입니다.");
    updateProfileMutation.mutate({
      name: name,
      bio: bio,
      imageFile: imageFile,
    });
  };

  if (isPending) return <Loading />;

  return (
    <div className="w-full min-h-[calc(100vh-70px)] bg-black flex flex-col items-center justify-center px-4 py-10">
      
      <div className="w-full max-w-3xl bg-[#161b22] rounded-4xl border border-neutral-800 p-10 md:p-14 shadow-2xl flex flex-col md:flex-row items-center gap-12 transition-all">
        
        <div 
          className="relative group cursor-pointer shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-neutral-700 bg-neutral-800 flex items-center justify-center shadow-inner">
            {imagePreview ? (
              <img src={imagePreview} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <User size={64} className="text-neutral-500" />
            )}
          </div>
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full">
            <Camera className="text-white" size={32} />
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="relative flex items-center group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full bg-transparent border-b-2 border-neutral-700 py-3 px-1 text-white text-3xl font-black focus:outline-none focus:border-red-600 transition-all placeholder:text-neutral-700"
            />
            <button 
              onClick={handleSubmit}
              disabled={updateProfileMutation.isPending}
              className="ml-4 p-2 text-neutral-500 hover:text-white transition-colors disabled:text-neutral-800"
            >
              {updateProfileMutation.isPending ? (
                <Loader2 size={32} className="animate-spin text-red-600" />
              ) : (
                <Check size={36} strokeWidth={3} />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Status Message</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="상태 메시지를 입력하세요 (Bio)"
              className="w-full bg-[#0d1117] border border-neutral-800 rounded-2xl py-4 px-6 text-neutral-200 text-base focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 ml-1">
            <span className="text-neutral-600 text-sm font-medium">Email:</span>
            <span className="text-neutral-400 text-sm font-semibold">{me?.data.email}</span>
          </div>
        </div>
      </div>

      <p className="mt-10 text-neutral-600 text-sm font-medium">
        정보를 수정한 후 <span className="text-neutral-400">오른쪽 체크 버튼</span>을 눌러 저장하세요. 🎵
      </p>
    </div>
  );
};