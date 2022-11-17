export const pingUrl = async (url: string) => {
  try {
    if (!url) return false;
    const res = await fetch(`${url}/node_info`);
    return res.status == 200 && res.ok;
  } catch (error) {
    return false;
  }
};