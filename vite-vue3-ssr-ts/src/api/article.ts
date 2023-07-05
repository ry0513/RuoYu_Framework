import instance from "@/utils/request";

export const _getList = () => {
  return instance({ url: "/list.json" });
};

export const _getDetails = (id: string) => {
  return instance({ url: `/id-${id}.json` });
};
