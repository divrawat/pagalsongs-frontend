
export async function getServerSideProps({ query, res }) {
  try {
    const { page } = query;
    const data = await GetAllSongs(page);
    // console.log(data);


    /*
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=10800, stale-while-revalidate=59'
    );
    */

    if (data.error) {
      return { props: { errorCode: 404 } };
    } else {
      return {
        props: {
          songs: data.data, totalCount: data.totalsongs, query: query
        }
      };
    }

  } catch (error) {
    console.error(error);
    return { props: { errorCode: 500 } };
  }
}


import Head from 'next/head';
import { GetAllSongs } from '@/actions/songs';
import { DOMAIN, APP_NAME, NOT_FOUND_IMAGE, APP_LOGO, IMAGES_SUBDOMAIN, DOMAIN_NAME, R2_SUBDOMAIN } from '@/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaHome } from "react-icons/fa";
import { Rubik } from '@next/font/google';
const roboto = Rubik({ subsets: ['latin'], weight: '800' });
const roboto2 = Rubik({ subsets: ['latin'], weight: '700' });
import dynamic from 'next/dynamic';
import slugify from 'slugify';
export const runtime = 'experimental-edge';

const Index = ({ errorCode, songs, query, totalCount }) => {

  if (errorCode) {
    return (
      <>
        <Navbar />
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mt-5 mb-8">404 Page Not Found</h1>
          <div className="flex justify-center items-center px-5">
            <img height={350} width={350} src={`${NOT_FOUND_IMAGE}`} className="rounded-full" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const router = useRouter();
  const { slug } = router.query;
  const [currentPage, setCurrentPage] = useState(Number(query.page) || 1);


  const [query2, setQuery2] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const myquery = slugify(query2, { lower: true, remove: /[*+~.()'"!:@]/g });
    router.push(`/search/${myquery}?page=1`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push(`${DOMAIN}/?page=${page}`);
  };

  const DESCRIPTION = `PagalWorld brings you the ultimate music downloading experience, offering a vast collection of songs in high-quality formats. Download the latest hits and timeless classics with ease, all from your favorite genres. Enjoy seamless access to your favorite tracks anytime, anywhere`;


  const head = () => (
    <Head>
      <title>PagalWorld: Free MP3 Songs</title>
      <meta name="description" content={DESCRIPTION} />
      <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
      <meta name="googlebot" content="noarchive" />
      <meta name="robots" content="noarchive" />
      {/* <link rel="canonical" href={`${DOMAIN}`} /> */}
      <meta property="og:title" content="PagalWorld: Free MP3 Songs" />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:type" content="webiste" />
      <meta property="og:url" content={`${DOMAIN}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta property="og:image:type" content="image/webp" />
    </Head >
  );


  const totalPages = Math.ceil(totalCount / 100);
  const maxPagesToShow = 5;
  const pageNumbers = [];

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  if (startPage > 1) { pageNumbers.push(1); if (startPage > 2) { pageNumbers.push('...'); } }
  for (let i = startPage; i <= endPage; i++) { pageNumbers.push(i); }
  if (endPage < totalPages) { if (endPage < totalPages - 1) { pageNumbers.push('...'); } pageNumbers.push(totalPages); }


  return (
    <>
      {head()}
      <Navbar />
      <main>
        <article>
          <div className=' max-w-[1200px] mx-auto p-3'>



            <form className="max-w-[700px] mx-auto px-5" onSubmit={handleSubmit}>
              <label htmlFor='default-search' className="mb-2 text-sm font-medium  sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                  </svg>
                </div>
                <input autoComplete='off' value={query2} onChange={(e) => setQuery2(e.target.value)} placeholder="Search for a Singer or Song ..." type="search" id="default-search" className="block w-full p-4 ps-10 text-sm border outline-none border-gray-300 rounded-lg " required />
                <button type="submit" className="text-white absolute end-2.5 font-bold bottom-2.5 bg-[#2683a8] hover:scale-110 transition-transform rounded-lg text-sm px-4 py-2">Search</button>
              </div>
            </form>



            <h1 className={`${roboto.className}  text-3xl font-semibold mb-3 mt-5 text-center`}>All Songs</h1>
            <p className='text-center mb-3 font-bold'>{`Total Songs: ${totalCount}`}</p>
            {/* <p className='text-center font-bold mb-8'>{`Page ${currentPage}`}</p> */}

            <ul className='flex justify-center gap-5 flex-wrap'>
              {songs?.map((song, index) => (

                <li className="hover:scale-110 transition-transform rounded w-[300px] " key={index}>
                  <Link prefetch={false} href={`${DOMAIN}/${song?.slug}/`}>

                    <div className='flex gap-3 my-10'>
                      <div className='w-[150px]'>
                        <img src={`${R2_SUBDOMAIN}/song-images/${song?.slug}.webp`} height={130} width={130} alt="" />
                      </div>

                      <div className='w-[150px]'>
                        <p className={`${roboto2.className} text-[15px]`}>{song.Name}</p>
                        {song.singer?.split(",").map((singer, i) => (
                          <p className='text-[12px]' key={i}>{singer.trim()}</p>
                        ))}
                        <p className='text-[12px]'>{song.duration}</p>
                      </div>

                    </div>

                  </Link>
                </li>
              )).slice(0, 2)}
            </ul>



            {/* <div className='flex justify-center flex-wrap items-center my-10 mx-4' id='pagination'>
              {pageNumbers?.map((pageNum, index) => (
                typeof pageNum === 'number' ? (
                  <Link prefetch={false} key={index} href={`${DOMAIN}/?page=${pageNum}`} onClick={() => handlePageChange(pageNum)}
                    className={`${roboto2.className} mx-2 px-3 py-1.5 text-sm rounded-lg ${currentPage === pageNum ? 'bg-[#0f2a33] text-white' : 'bg-[white] hover:bg-[#0f2a33] hover:text-white text-[black]'}`}
                  >
                    {pageNum}
                  </Link>
                ) : (
                  <span key={index} className={`${roboto2.className} mx-2 px-3 py-1.5 text-sm rounded-lg text-[black]`}>
                    {pageNum}
                  </span>
                )
              ))}
            </div> */}




          </div>


        </article>
      </main >
      <Footer />
    </>
  );
};


export default Index;
