import { ApiSuccess } from "@/src/interface/api";
import { CommentType, feedType } from "@/src/interface/post";
import {
  loadAllFeedContents,
  loadComment,
} from "@/src/service/api/snsApi";
import { apiProcess } from "@/src/utils/handler/clientResHandler";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const snsFeedStore = create(
  combine(
    {
      feeds: [] as feedType[],
      comments: [] as CommentType[],
      showComments: false,
      selectedPostId: "",
    },
    (set) => {
      return {
        fetchFeedData: async () => {
          const res = await loadAllFeedContents();
          apiProcess(res, async (res: ApiSuccess) => {
            set(() => ({
              feeds: res.response.data,
            }));
          });
        },
        updateCount: async (postId: string) => {
          set((state) => {
            const index = state.feeds.findIndex((item) => item.id === postId);
            if (index === -1) return { feeds: state.feeds };

            const targetFeed = state.feeds[index] as feedType;

            const updatedFeed = {
              ...targetFeed,
              isLiked: !targetFeed.isLiked,
              likeCount: targetFeed.isLiked
                ? targetFeed.likeCount - 1
                : targetFeed.likeCount + 1,
            };

            const newFeeds = [...state.feeds];
            newFeeds[index] = updatedFeed;

            return { feeds: newFeeds };
          });
        },
        setShowComment: (state: boolean) => {
          set(() => ({ showComments: state }));
        },
        fetchSelectedFeedComments: async (selectedPostId: string) => {
          const res = await loadComment(selectedPostId);
          apiProcess(res, async (res: ApiSuccess) => {
            set(() => ({
              comments: res.response.data,
            }));
          });
        },
        closeComment: () => {
          set(() => ({
            comments: [],
            showComments: false,
          }));
        },
        selectPost: (id: string) => {
          set(() => ({
            selectedPostId: id,
          }));
        },
      };
    }
  )
);
