import { _getList, _getDetails } from "@/api/article";
import { defineStore } from "pinia";
import { reactive, ref, toRefs } from "vue";

export const useArticleStore = defineStore(
  "articleStore",
  () => {
    const state: {
      lists: any[];
      details: any;
    } = reactive({
      lists: [],
      details: {},
    });

    const getList = () => {
      return new Promise((resolve) => {
        _getList().then(({ data: { rows } }) => {
          state.lists = rows;
          resolve(true);
        });
      });
    };

    const getDetails = (id: string) => {
      return new Promise((resolve) => {
        _getDetails(id).then(({ data: { data } }) => {
          state.details = data;
          resolve(true);
        });
      });
    };

    return {
      ...toRefs(state),
      getList,
      getDetails,
    };
  }
  // {
  //   persist: {
  //     paths: ["details"],
  //   },
  // }
);
