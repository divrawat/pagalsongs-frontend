export async function getServerSideProps({ params, res }) {
    try {
        const response = await GetSingleSong(params?.slug);
        if (response?.error) { return { props: { errorcode: true } }; }

        res.setHeader('Cache-Control', 'public, s-maxage=10800, stale-while-revalidate=59');

        return { props: { response } };

    } catch (error) {
        console.error('Error fetching song data:', error);
        return { props: { errorcode: true } };
    }
}




import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Head from 'next/head';
import { GetSingleSong } from '@/actions/songs';
import { DOMAIN, APP_NAME, NOT_FOUND_IMAGE, APP_LOGO, R2_SUBDOMAIN, BACKEND_DOMAIN } from '@/config';
import { FaHome } from "react-icons/fa";
import { Rubik } from '@next/font/google';
import { AiFillChrome } from "react-icons/ai";
const roboto = Rubik({ subsets: ['latin'], weight: '800' });
const roboto2 = Rubik({ subsets: ['latin'], weight: '600', });
const roboto3 = Rubik({ subsets: ['latin'], weight: '300', });
import { useState } from 'react';
import { useRouter } from 'next/router';
import slugify from 'slugify';
import dynamic from 'next/dynamic';
// const MyDynamicComp = dynamic(() => import('@/components/MyDynamicComp'), { ssr: false });
export const runtime = 'experimental-edge';


const SongPage = ({ errorcode, response }) => {

    const song = response;


    if (errorcode) {
        const head = () => (
            <Head>
                <title>{`404 Page Not Found: ${APP_NAME}`}</title>
            </Head >
        );
        return (
            <>
                {head()}
                <Navbar />
                <div className="text-cente">
                    <h1 className="text-3xl font-bold mt-5 mb-8 text-center">404 Page Not Found</h1>
                    <div className="flex justify-center items-center px-5">
                        <img height={350} width={350} src={`${NOT_FOUND_IMAGE}`} className="rounded-full" />
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const DESCRIPTION = `${song?.Name} song download mp3 by ${song?.singer} in 120 Kbps, 320 Kbps quality. `;



    // let slug = song?.slug;
    // let cleanedSlug = slug.replace(/-?(download|mp3|song)-?/g, '').replace(/--/g, '-').replace(/^-|-$/g, '');
    // let cleanedSlug = slug.replace(/-?(download|mp3|song).*$/g, '').replace(/--/g, '-').replace(/^-|-$/g, '');

    let downloadOptions = [];

    if (song?.downloads.includes("Download Mp3 File")) {
        downloadOptions = [{ quality: "Mp3 File", qualityNumber: "mp3" }];
    } else {
        downloadOptions = song?.downloads.split(",").map(option => {
            let [quality, size] = option.trim().split(" - ");
            let qualityNumber = quality.match(/\d+/)[0];
            return { quality, qualityNumber, size };
        });

        downloadOptions = downloadOptions.filter(option =>
            option.qualityNumber === '320' || option.qualityNumber === '128'
        );

        downloadOptions.sort((a, b) => {
            let sizeA = parseFloat(a.size);
            let sizeB = parseFloat(b.size);
            return sizeA - sizeB;
        });
    }

    const audioSchema = {
        "@context": "https://schema.org",
        "@type": "AudioObject",
        "name": `${song?.Name}`,
        "description": `${song?.Name} Song Download Mp3 For Free`,
        "contentUrl": song?.downloads.includes("Download Mp3 File")
            ? `${R2_SUBDOMAIN}/song-audio/${song?.slug}.mp3`
            : `${R2_SUBDOMAIN}/song-audio/${song?.slug}-320.mp3`,
        "duration": `${song?.duration} seconds`,
        "encodingFormat": "mp3",
        "inLanguage": "en",
    };


    const head = () => (
        <Head>
            <title>{`${song?.Name} Song Download Mp3 120 Kbps, 320 Kbps: ${APP_NAME}`}</title>
            <meta name="description" content={DESCRIPTION} />
            <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
            <meta name="googlebot" content="noarchive" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="article" />
            <link rel="canonical" href={`${DOMAIN}/${song?.slug}`} />
            <meta property="og:title" content={`${song?.Name} Song Download Mp3 120 Kbps, 320 Kbps: ${APP_NAME}`} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}/${song?.slug}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image" content={`${R2_SUBDOMAIN}/song-images/${song?.slug}.webp`} />
            <meta property="og:image:secure_url" content={`${R2_SUBDOMAIN}/song-images/${song?.slug}.webp`} />
            <meta property="og:image:type" content="image/webp" />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(audioSchema) }} />
        </Head >
    );







    const router = useRouter();
    const [query2, setQuery2] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const myquery = slugify(query2, { lower: true, remove: /[*+~.()'"!:@]/g });
        router.push(`/search/${myquery}?page=1`);
    };




    // Helper function to slugify individual categories
    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\b(ringtone|ringtones|mp3|2024|2023|2022|2021|song|songs|new)\b/g, '') // Remove "ringtone" and "ringtones"
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+|-+$/g, '');
    };










    return (
        <>
            {head()}
            <Navbar />

            <main>
                <article className='px-5'>


                    <form className="max-w-[700px] mx-auto px-5 mt-5" onSubmit={handleSubmit}>
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











                    <h1 className={`${roboto.className} text-[23px] px-2 font-bold tracking-wider text-center mt-5 mb-5`}>{`${song?.Name} Song Download Mp3 - 120 Kbps, 320 Kbps`}</h1>

                    <div className='flex justify-center text-[13px] px-4 flex-wrap items-center gap-3 md:mb-10 mb-5 text-blue-600'>
                        <div className='flex items-center gap-2'>
                            <div><FaHome /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}`}>Home</Link></div>
                        </div>
                        <div>{`>`}</div>
                        <div className='flex items-center gap-2'>
                            <div><AiFillChrome /></div>
                            <div><Link prefetch={false} href={`${DOMAIN}/${song?.slug}`}>{`${song?.Name} Song Download`}</Link></div>
                        </div>
                    </div>


                    <div className='md:flex justify-center gap-20'>

                        <div className='flex justify-center mb-5 md:block'><img src={`${R2_SUBDOMAIN}/song-images/${song?.slug}.webp`} alt={`${song?.Name} song cover`} /></div>

                        <div>

                            <div className="relative overflow-x-auto ">
                                <table className="w-full text-sm text-left rtl:text-right  ">

                                    <tbody>

                                        {song.singer && (
                                            <tr className="border-b border-[#c5c1c1]">
                                                <th scope="row" className="px-6 py-3 font-bold whitespace-nowrap">
                                                    Singer
                                                </th>
                                                <td className="px-6 py-3 text-blue-600">
                                                    {song.singer.split(',').map((singer, index, array) => (
                                                        <span key={index}>
                                                            <Link href={`${DOMAIN}/search/${slugify(singer)}?page=1`}>
                                                                {singer.trim()}
                                                            </Link>
                                                            {index < array.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        )}




                                        {song.lyrics && (
                                            <tr className="border-b border-[#c5c1c1]">
                                                <th scope="row" className="px-6 py-3 font-bold whitespace-nowrap">
                                                    Lyrics
                                                </th>
                                                <td className="px-6 py-3 text-blue-600">
                                                    {song.lyrics.split(',').map((lyricist, index, array) => (
                                                        <span key={index}>
                                                            <Link href={`${DOMAIN}/search/${slugify(lyricist)}?page=1`}>
                                                                {lyricist.trim()}
                                                            </Link>
                                                            {index < array.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        )}

                                        {song.music && (
                                            <tr className="border-b border-[#c5c1c1]">
                                                <th scope="row" className="px-6 py-3 font-bold whitespace-nowrap">
                                                    Music
                                                </th>
                                                <td className="px-6 py-3 text-blue-600">
                                                    {song.music.split(',').map((musician, index, array) => (
                                                        <span key={index}>
                                                            <Link href={`${DOMAIN}/search/${slugify(musician)}?page=1`}>
                                                                {musician.trim()}
                                                            </Link>
                                                            {index < array.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        )}

                                        {song.label && (
                                            <tr className="border-b border-[#c5c1c1]">
                                                <th scope="row" className="px-6 py-3 font-bold whitespace-nowrap">
                                                    Label
                                                </th>
                                                <td className="px-6 py-3 text-blue-600">
                                                    {song.label.split(',').map((label, index, array) => (
                                                        <span key={index}>
                                                            <Link href={`${DOMAIN}/search/${slugify(label)}?page=1`}>
                                                                {label.trim()}
                                                            </Link>
                                                            {index < array.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        )}



                                        {song.duration && <tr className="border-b border-[#c5c1c1] ">
                                            <th scope="row" className="px-6 py-3 font-bold  whitespace-nowrap">
                                                Duration
                                            </th>
                                            <td className="px-6 py-3">
                                                {song?.duration}
                                            </td>
                                        </tr>}

                                        {song.size && <tr className="border-b border-[#c5c1c1]">
                                            <th scope="row" className="px-6 py-3 font-bold  whitespace-nowrap">
                                                Size
                                            </th>
                                            <td className="px-6 py-3">
                                                {song?.size}
                                            </td>
                                        </tr>}

                                        {song.Categories && (
                                            <tr className="border-b border-[#c5c1c1] ">
                                                <th scope="row" className="px-6 py-3 font-bold whitespace-nowrap">
                                                    Category
                                                </th>
                                                <td className="px-6 py-3 text-blue-600">
                                                    {song.Categories.split(',').map((category, index, array) => (
                                                        <span key={index}>
                                                            <Link href={`${DOMAIN}/search/${slugify(category)}?page=1`}>
                                                                {category.trim()}
                                                            </Link>
                                                            {index < array.length - 1 && ', '}
                                                        </span>
                                                    ))}
                                                </td>
                                            </tr>
                                        )}


                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>


                    {
                        song?.downloads.includes("Download Mp3 File") ? (
                            <div className='flex justify-center my-6'>
                                <audio src={`${R2_SUBDOMAIN}/song-audio/${song?.slug}.mp3`} preload="auto" controls></audio>
                            </div>

                        ) : (
                            <div className='flex justify-center my-6'>
                                <audio src={`${R2_SUBDOMAIN}/song-audio/${song?.slug}-320.mp3`} preload="auto" controls></audio>
                            </div>

                        )
                    }





                    <h2 className={`${roboto.className} text-[21px] font-bold text-center mt-10`}>{`${song.Name} Song Download Links`}</h2>

                    <div className='flex justify-center flex-wrap gap-10 mt-10'>
                        {downloadOptions.map((option, index) => (
                            <div key={index} className='hover:scale-110 transition-transform'>
                                <a
                                    href={`${BACKEND_DOMAIN}/api/download/${song?.slug}/${option.qualityNumber}/${song?.Name}`}
                                    className={`${roboto2.className} bg-[#3b98bd] text-white  p-3 text-[12px] rounded-md`}>
                                    {option.size ? `${option.quality} - ${option.size}` : option.quality}
                                </a>
                            </div>
                        ))}
                    </div>

                    <h2 className={`${roboto.className} text-[21px] font-bold text-center mt-10`}>{`About ${song.Name} Song`}</h2>

                    <div className='max-w-[800px] mx-auto text-sm'>
                        {song?.singer && <p className='text-center mt-5'>{`${song.Name} song is sung by ${song?.singer}.`}</p>}
                        {song?.label && <p className='text-center mt-5'>{`It is released under Label "${song?.label}".`}</p>}
                        {song?.downloads && <p className='text-center leading-[25px] mt-5'>{`This song is available for download in the following formats: ${song.downloads} on our website.`}</p>}
                    </div>
                </article >
            </main>
            <Footer />
        </>
    );
}


export default SongPage;