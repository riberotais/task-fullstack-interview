import Head from 'next/head';
import Dropdown from './components/Dropdown.client';


export default function Home() {
  return (
    <main className='bg-slate-50 '>
      <div className=''>
      <Head>
        <title className='text-center'>Country Info</title>
        <meta name="description" content="" />
      </Head>

      <main className='flex flex-col items-center'>
        <h3 className='p-4 text-center text-zinc-700'>Country GDP Information</h3>
        <Dropdown />
      </main>
    </div>

    </main>
    
  )
}
