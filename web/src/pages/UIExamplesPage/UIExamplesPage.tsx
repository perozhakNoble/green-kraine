import { MetaTags } from '@redwoodjs/web'

const UiExamplesPage = () => {
  return (
    <>
      <MetaTags title="UI Examples" description="UI Examples page" />

      <h1>UI Examples Page</h1>

      <div className="w-full">
        <h2 className="font-thin">Thin - Україна і Green - Kraine</h2>
        <h2 className="font-extralight">
          Extralight - Україна і Green - Kraine
        </h2>
        <h2 className="font-light">Light - Україна і Green - Kraine</h2>
        <h2 className="font-normal">Normal - Україна і Green - Kraine</h2>
        <h2 className="font-medium ">Medium - Україна і Green - Kraine</h2>
        <h2 className="font-semibold">Semibold - Україна і Green - Kraine</h2>
        <h2 className="font-bold">Bold - Україна і Green - Kraine</h2>
        <h2 className="font-extrabold">Extrabold - Україна і Green - Kraine</h2>
      </div>
    </>
  )
}

export default UiExamplesPage
