import { GetStaticProps, NextPage } from 'next';

const Page404: NextPage = () => {
  return <div className="page404">Page Not Found</div>;
};

export default Page404;

export const getStaticProps: GetStaticProps = () => {
  return { props: {} };
};
