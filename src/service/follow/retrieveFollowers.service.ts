import retrieveFollowers from "../../functions/followers/retrieveFollowers";

const retrieveFollowersService = async (
  accountId: string,
  page?: number,
  pageSize?: number
) => {
  try {
    const result = await retrieveFollowers(accountId, page, pageSize);

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

export default retrieveFollowersService;
