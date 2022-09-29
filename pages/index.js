import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Header from '../components/header'
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lottery Contract</title>
        <meta name="description" content="Decentralized Lottery App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
    </div>
  )
}
