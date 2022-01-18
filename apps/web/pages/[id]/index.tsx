import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "react-query";
import { defaultQueryFn } from "../../lib/query-client";

export { VotePollPage as default } from "../../modules/polls/VotePollPage";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();
  const id = typeof params.id === "string" ? params.id : "";

  await queryClient.prefetchQuery({
    queryFn: defaultQueryFn,
    queryKey: `/polls/${id}`
  });

  return {
    props: {
      dehydrateState: dehydrate(queryClient)
    }
  };
};
