import { GetStaticProps } from "next";

import Prismic from 'prismic-javascript';
import { RichText } from 'prismic-reactjs';
import { client } from '@/src/config/prismic_configuration';
import ApiSearchResponse from 'prismic-javascript/types/ApiSearchResponse';

/*    Components*/
import AnimationInView from '@/src/components/AnimationInView'
import Header from '@/src/components/Header'
import Presentation from '@/src/components/Presentation'
import Materia, { post } from "@/src/components/Materia";
import Footer from "@/src/components/Footer";
import Head from 'next/head';

interface PropTypes {
  posts: Array<post>;
}

export default function HomeBlogPage({ posts }: PropTypes): JSX.Element {

  return (
    <>
      <Head>
        <title>Blog | Educação Bento</title>
        <meta
          name="og:title"
          property="og:title"
          content='Blog | Educação Bento'
        />
        <meta
          name="description"
          content='Sua plataforma de estudos gratuita'
        />

      </Head>
      <Header></Header>
      <AnimationInView>
        <Presentation title="Blog" description="Sua plataforma de estudos gratuito" image='/img/blog.svg' />
      </AnimationInView>

      <h1 className='title'>Ultimas Publicações</h1>
      {posts.map(post => (
        <Materia post={post} key={post.slug} />
      ))}

      <Footer />
    </>
  );
}


export const getStaticProps: GetStaticProps = async () => {


  const response = await client.query(
    Prismic.Predicates.at('document.type', 'blog_posts'),
    { orderings: '[my.blog-posts.date desc]', pageSize: 100 }
  );

  const posts = response.results.map((post) => (
    {
      materia: post.data.materia,
      title: post.data.title[0].text,
      slug: post.uid,
      description: post.data.description[0].text
    }
  )
  );

  return {
    props: {
      posts
    },
    revalidate: 10
  };
};
