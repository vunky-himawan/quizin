import { Button } from "@/components/ui/button";

const IndexPage = () => {
  return (
    <>
      <main className="p-5 w-screen h-screen max-w-7xl mx-auto">
        <section className="grid grid-rows-2 grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 justify-between items-center h-full">
          <div className="flex flex-col items-center lg:order-2">
            <img
              src="/images/lucent-thinking-and-creating-ideas.png"
              alt=""
              className="max-w-[80%] lg:w-full"
            />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="font-bold text-4xl lg:text-6xl">
              Tantang Diri Anda - Mainkan Kuisnya!
            </h1>
            <p className="lg:text-xl">
              Anda merasa sudah mengetahui semuanya? Uji pengetahuan Anda dengan
              kuis kami yang menyenangkan dan menarik!
            </p>
            <a href="/login">
              <Button className="bg-sky-500 w-fit">Login</Button>
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

export default IndexPage;
