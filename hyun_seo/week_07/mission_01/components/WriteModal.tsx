import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Camera } from "lucide-react";
import { useRef, useState } from "react";

export const WriteModal = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const {mutate, isPending} = useMutation({
    mutationFn: async(formData: FormData) => {
      const response = await fetch("/api/lp", {
        method: "POST", 
        body: formData,
      });
      if (!response.ok) throw new Error("LP 등록 실패");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["lpList"]});
      onClose();
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    if (!title || !content || !imageFile) {
      alert("이미지와 내용을 모두 입력해주세요");
      return
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("thumbnail", imageFile);

    formData.append("tags", JSON.stringify(tags));

    mutate(formData);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose} 
    >
      <div 
        className="bg-[#1c2128] w-full max-w-md rounded-2xl p-6 border border-neutral-800 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-6 mt-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-40 h-40 bg-black rounded-full border-4 border-neutral-700 flex items-center justify-center shadow-inner overflow-hidden cursor-pointer"
          >
            {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-neutral-500 group-hover:text-neutral-300">
                <Camera size={32} />
                <span className="text-xs mt-1">Add Photo</span>
              </div>
            )}
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

            <div className="w-full space-y-3">
              <input 
                type="text" 
                placeholder="LP Name" 
                value={title}
                onChange={(e) => setTitle(e. target.value)}
                className="w-full bg-[#2d333b] border border-neutral-700 rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-red-700" 
              />
              <textarea 
                placeholder="LP Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#2d333b] border border-neutral-700 rounded-lg p-3 text-white h-24 resize-none focus:outline-none focus:ring-1 focus:ring-red-700" 
              />
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="LP Tag" 
                    className="flex-1 bg-[#2d333b] border border-neutral-700 rounded-lg p-3 text-white focus:outline-none" 
                  />
                  <button 
                    onClick={handleAddTag}
                    className="bg-neutral-600 px-4 rounded-lg text-white font-medium hover:bg-neutral-500"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 bg-red-900/30 text-red-400 border border-red-800/50 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag} 
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="hover:text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

          <button 
            onClick={handleSubmit}
            disabled={isPending}
            className={`w-full py-4 font-bold rounded-xl transition-colors 
              ${imagePreview && title && content && !isPending 
                ? 'bg-[#E50914] text-white hover:bg-red-700' 
                : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'}`}
          >
            {isPending ? "Adding..." : "Add LP"}
          </button>
        </div>
      </div>
    </div>
  );
};