import { ApiSuccess } from "@/src/interface/api";
import { addedPetInfo } from "@/src/interface/chat";
import { getMyPet } from "@/src/service/chatApi";
import { apiProcess } from "@/src/utils/handler/clientResHandler";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const helpWithAiStore = create(
  combine(
    {
      chatType: "loading" as "loading" | "chat" | "add",
      petList: [] as addedPetInfo[],
      selectedPet: {} as addedPetInfo,
    },
    (set) => {
      return {
        fetchPetList: async () => {
          const res = await getMyPet();
          apiProcess(res, async (res) => {
            const petList = res.response.data.animalInfos;
            if (petList.length === 0) {
              set(() => ({ chatType: "add" }));
            } else {
              set(() => ({
                petList,
                selectedPet: petList[0],
                chatType: "chat",
              }));
            }
          });
        },
        handleSelectPet: async (pet: addedPetInfo) => {
          set(() => ({ selectedPet: pet }));
        },
        setChatType: (type: "loading" | "chat" | "add") => {
          set(() => ({ chatType: type }));
        },
      };
    }
  )
);
