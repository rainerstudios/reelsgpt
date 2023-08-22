'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import DropDown, { VibeType } from '../components/DropDown';
import Footer from '../components/Footer';
import Github from '../components/GitHub';
import Header from '../components/Header';
import { useChat } from 'ai/react';

export default function Page() {
  const [bio, setBio] = useState('');
  const [vibe, setVibe] = useState<VibeType>('Professional');
  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      body: {
        vibe,
        bio,
      },
      onResponse() {
        scrollToBios();
      },
    });

  const onSubmit = (e: any) => {
    setBio(input);
    handleSubmit(e);
  };

  const lastMessage = messages[messages.length - 1];
  const generatedBios = lastMessage?.role === "assistant" ? lastMessage.content : null;

  return (
    <div className="flex flex-col items-center justify-center max-w-5xl min-h-screen py-2 mx-auto">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 mt-12 text-center sm:mt-20">
        <a
          className="flex items-center justify-center px-4 py-2 mb-5 space-x-2 text-sm text-gray-600 transition-colors bg-white border border-gray-300 rounded-full shadow-md max-w-fit hover:bg-gray-100"
          href="https://github.com/Nutlope/twitterbio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your next Social media bio using chatGPT
        </h1>
        <p className="mt-5 text-slate-500">47,118 bios generated so far.</p>
        <form className="w-full max-w-xl" onSubmit={onSubmit}>
          <div className="flex items-center mt-10 space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="font-medium text-left">
              Copy your current bio{' '}
              <span className="text-slate-500">
                (or write a few sentences about yourself)
              </span>
              .
            </p>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            rows={4}
            className="w-full my-5 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
            placeholder={
              'e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com.'
            }
          />
          <div className="flex items-center mb-5 space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="font-medium text-left">Select your vibe.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!isLoading && (
            <button
              className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
              type="submit"
            >
              Generate your bio &rarr;
            </button>
          )}
          {isLoading && (
            <button
              className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl sm:mt-10 hover:bg-black/80"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
              </span>
            </button>
          )}
        </form>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <output className="my-10 space-y-10">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="mx-auto text-3xl font-bold sm:text-4xl text-slate-900"
                  ref={bioRef}
                >
                  Your generated bios
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-8">
                {generatedBios
                  .substring(generatedBios.indexOf('1') + 3)
                  .split('2.')
                  .map((generatedBio) => {
                    return (
                      <div
                        className="p-4 transition bg-white border shadow-md rounded-xl hover:bg-gray-100 cursor-copy"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast('Bio copied to clipboard', {
                            icon: '✂️',
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </output>
      </main>
      <Footer />
    </div>
  );
}
