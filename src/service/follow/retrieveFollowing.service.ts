import retrieveFollowing from "../../functions/followers/retrieveFollowing";

const retrieveFollowingService = async (
  accountId: string,
  page?: number,
  pageSize?: number
) => {
  try {
    const result = await retrieveFollowing(accountId, page, pageSize);

    return {
      success: true,
      body: result,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export default retrieveFollowingService;
