import retrieveFeed from "../../functions/feed/retrieveFeed";

const retrieveFollowerFeedService = async (accountId: string) => {
  try {
    const result = await retrieveFeed(accountId);

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

export default retrieveFollowerFeedService;
