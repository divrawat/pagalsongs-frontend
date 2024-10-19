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
import { DOMAIN, APP_NAME, NOT_FOUND_IMAGE, APP_LOGO, IMAGES_SUBDOMAIN } from '@/config';
import { FaHome } from "react-icons/fa";
import { Rubik } from '@next/font/google';
import { AiFillChrome } from "react-icons/ai";
const roboto = Rubik({ subsets: ['latin'], weight: '800' });
const roboto2 = Rubik({ subsets: ['latin'], weight: '600', });
const roboto3 = Rubik({ subsets: ['latin'], weight: '300', });
import dynamic from 'next/dynamic';
const MyDynamicComp = dynamic(() => import('@/components/MyDynamicComp'), { ssr: false });
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

    const DESCRIPTION = `Read ${song?.song?.name} ${song?.song?.type} online. ${song?.song?.description}`;


    const head = () => (
        <Head>
            <title>{`${song?.Name} Song Download`}</title>
            <meta name="description" content={DESCRIPTION} />
            <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
            <meta name="googlebot" content="noarchive" />
            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="article" />
            <link rel="canonical" href={`${DOMAIN}/song/`} />
            <meta property="og:title" content={`${song?.song?.name} ${song?.song?.type}`} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}/song/`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />
            <meta property="og:image" content={`${IMAGES_SUBDOMAIN}/${song?.song?.slug}/cover-image/1.webp`} />
            <meta property="og:image:secure_url" content={`${IMAGES_SUBDOMAIN}/${song?.song?.slug}/cover-image/1.webp`} />
            <meta property="og:image:type" content="image/webp" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${song?.song?.name} ${song?.song?.type}: ${APP_NAME}`} />
            <meta name="twitter:description" content={DESCRIPTION} />
            <meta name="twitter:site" content="@songchimp" />
            <meta name="twitter:creator" content="@songchimp" />
            <meta name="twitter:image" content={`${IMAGES_SUBDOMAIN}/${song?.song?.slug}/cover-image/1.webp`} />
            <meta name="twitter:label1" content="Written by" />
            <meta name="twitter:data1" content={`${APP_NAME}`} />
            <meta name="twitter:label2" content="Time to read" />
            <meta name="twitter:data2" content="1 minute" />
        </Head >
    );

    let slug = song?.slug;
    // let cleanedSlug = slug.replace(/-?(download|mp3|song)-?/g, '').replace(/--/g, '-').replace(/^-|-$/g, '');
    let cleanedSlug = slug.replace(/-?(download|mp3|song).*$/g, '').replace(/--/g, '-').replace(/^-|-$/g, '');

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



    return (
        <>
            {head()}
            <Navbar />

            <main>
                <article className='px-5'>
                    <h1 className={`${roboto.className} text-[23px] px-2 font-bold tracking-wider text-center mt-5 mb-5`}>{`${song?.Name} Song Download Mp3`}</h1>

                    <div className='flex justify-center text-[13px] px-4 flex-wrap items-center gap-3 mb-10 text-blue-600'>
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

                        <div><img src="https://www.pagalworld.com.sb/siteuploads/thumb/sft145/72358_4.jpg" alt="" /></div>

                        <div>

                            <div className="relative overflow-x-auto ">
                                <table className="w-full text-sm text-left rtl:text-right  ">

                                    <tbody>
                                        {/* <tr className="border-b border-t border-[#c5c1c1] ">
                                            <th scope="row" className="px-6 py-3 font-bold  whitespace-nowrap">
                                                Song Name
                                            </th>
                                            <td className="px-6 py-3">
                                                {song?.Name}
                                            </td>
                                        </tr> */}

                                        {song.singer && <tr className="border-b border-[#c5c1c1] ">
                                            <th scope="row" className="px-6 py-3 font-bold  whitespace-nowrap">
                                                Singer
                                            </th>
                                            <td className="px-6 py-3">
                                                {song?.singer}
                                            </td>
                                        </tr>}

                                        {song.lyrics && <tr className="border-b border-[#c5c1c1] ">
                                            <th scope="row" className="px-6 py-3 font-bold  whitespace-nowrap ">
                                                Lyrics
                                            </th>
                                            <td className="px-6 py-3">
                                                {song?.lyrics}
                                            </td>
                                        </tr>}

                                        {song.music && <tr className="border-b border-[#c5c1c1] ">
                                            <th scope="row" className="px-6 py-3 font-bold  whitespace-nowrap ">
                                                Music
                                            </th>
                                            <td className="px-6 py-3">
                                                {song?.music}
                                            </td>
                                        </tr>}

                                        {song.label && <tr className="border-b border-[#c5c1c1] ">
                                            <th scope="row" className="px-6 py-3 font-bold  whitespace-nowrap">
                                                Label
                                            </th>
                                            <td className="px-6 py-3">
                                                {song?.label}
                                            </td>
                                        </tr>}


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

                                        {song.Categories && <tr className="border-b border-[#c5c1c1] ">
                                            <th scope="row" className="px-6 py-3 font-bold  whitespace-nowrap">
                                                Category
                                            </th>
                                            <td className="px-6 py-3">
                                                {song?.Categories}
                                            </td>
                                        </tr>}

                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>

                    <h2 className={`${roboto.className} text-[21px] font-bold text-center mt-10`}>{`${song.Name} Song Download Links`}</h2>

                    <div className='flex justify-center flex-wrap gap-10 mt-10'>
                        {downloadOptions.map((option, index) => (
                            <div key={index} className='hover:scale-110 transition-transform'>
                                <a href={`${DOMAIN}/${cleanedSlug}-${option.qualityNumber}`}
                                    className={`${roboto2.className} bg-[#3b98bd] text-white  p-3 text-[12px] rounded-md`}>


                                    {option.size
                                        ? `${option.quality} - ${option.size}` // Display quality and size if available
                                        : option.quality}

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