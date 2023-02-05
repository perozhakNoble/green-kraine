import { faRadio, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { MetaTags } from '@redwoodjs/web'

import Button from 'src/components/UI/Button'
import { H1, H2, H3, H4, H5, H6, H7 } from 'src/components/UI/Typography'

const UiExamplesPage = () => {
  return (
    <>
      <MetaTags title="UI Examples" description="UI Examples page" />

      <div className="w-full p-6">
        <h1 className="text-2xl">UI Examples Page</h1>

        {/*Font weight*/}
        <div className="p-2">
          <h2 className="text-xl my-2">Font weight</h2>
          <h3 className="font-thin">
            Україна, Екологія, Здоровʼя | GreenKraine - Thin
          </h3>
          <h3 className="font-extralight">
            Україна, Екологія, Здоровʼя | GreenKraine - Extraligh
          </h3>
          <h3 className="font-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Light
          </h3>
          <h3 className="font-normal">
            Україна, Екологія, Здоровʼя | GreenKraine - Normal
          </h3>
          <h3 className="font-medium ">
            Україна, Екологія, Здоровʼя | GreenKraine - Medium
          </h3>
          <h3 className="font-semibold">
            Україна, Екологія, Здоровʼя | GreenKraine - Semibold
          </h3>
          <h3 className="font-bold">
            Україна, Екологія, Здоровʼя | GreenKraine - Bold
          </h3>
          <h3 className="font-extrabold">
            Україна, Екологія, Здоровʼя | GreenKraine - Extrabold
          </h3>
        </div>

        {/*Font color*/}
        <div className="p-2">
          <h2 className="text-xl my-2">Font color</h2>
          <h3 className="text-error">
            Україна, Екологія, Здоровʼя | GreenKraine - Error
          </h3>
          <h3 className="text-error-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Error Light
          </h3>
          <h3 className="text-secondary-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Secondary Light
          </h3>
          <h3 className="text-secondary">
            Україна, Екологія, Здоровʼя | GreenKraine - Secondary
          </h3>
          <h3 className="text-dark">
            Україна, Екологія, Здоровʼя | GreenKraine - Secondary Dark
          </h3>
          <h3 className="text-warning-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Warning Light
          </h3>
          <h3 className="text-warning">
            Україна, Екологія, Здоровʼя | GreenKraine - Warning
          </h3>
          <h3 className="text-primary-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Primary Light
          </h3>
          <h3 className="text-primary">
            Україна, Екологія, Здоровʼя | GreenKraine - Primary
          </h3>
          <h3 className="text-primary-dark">
            Україна, Екологія, Здоровʼя | GreenKraine - Primary Dark
          </h3>
        </div>

        {/*Custom Headers*/}
        <div className="p-2">
          <h2 className="text-xl my-2">Custom Headers</h2>
          <H1>Україна, Екологія, Здоровʼя | GreenKraine - H1</H1>
          <H2>Україна, Екологія, Здоровʼя | GreenKraine - H2</H2>
          <H3>Україна, Екологія, Здоровʼя | GreenKraine - H3</H3>
          <H4>Україна, Екологія, Здоровʼя | GreenKraine - H4</H4>
          <H5>Україна, Екологія, Здоровʼя | GreenKraine - H5</H5>
          <H6>Україна, Екологія, Здоровʼя | GreenKraine - H6</H6>
          <H7>Україна, Екологія, Здоровʼя | GreenKraine - H7</H7>
        </div>

        {/*Buttons*/}
        <div className="p-2">
          <h2 className="text-xl my-2">Buttons</h2>

          <div className="flex gap-8">
            {/*primary*/}
            <div className="ml-2">
              <h2 className="text-lg my-2">Primary</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="primary"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="text-lg my-2">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="primary"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="text-lg my-2">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="primary"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="text-lg my-2">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Primary"
                color="primary"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>
            {/*secondary*/}
            <div className="ml-2">
              <h2 className="text-lg my-2">Secondary</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="secondary"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="text-lg my-2">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="secondary"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="text-lg my-2">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="secondary"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="text-lg my-2">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="secondary"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>
            {/*dark*/}
            <div className="ml-2">
              <h2 className="text-lg my-2">Dark</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="dark"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="text-lg my-2">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="dark"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="text-lg my-2">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="dark"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="text-lg my-2">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="dark"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>
            {/*error*/}
            <div className="ml-2">
              <h2 className="text-lg my-2">Error</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="error"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="text-lg my-2">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="error"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="text-lg my-2">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="error"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="text-lg my-2">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="error"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>

            {/*warning*/}
            <div className="ml-2">
              <h2 className="text-lg my-2">Warning</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="warning"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="text-lg my-2">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="warning"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="text-lg my-2">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="warning"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="text-lg my-2">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="warning"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>
          </div>

          <div className="flex gap-x-8 flex-wrap p-2">
            {/*default*/}
            <div>
              <h2 className="text-lg my-2">Default</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*depth sm*/}
            <div>
              <h2 className="text-lg my-2">Depth SM</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                depth="sm"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*depth lg*/}
            <div>
              <h2 className="text-lg my-2">Depth LG</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                depth="lg"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*rounded sm*/}
            <div>
              <h2 className="text-lg my-2">Rounded SM</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                rounded="sm"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*rounded md*/}
            <div>
              <h2 className="text-lg my-2">Rounded MD</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                rounded="md"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*rounded lg*/}
            <div>
              <h2 className="text-lg my-2">Rounded lg</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                rounded="lg"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*size xs*/}
            <div>
              <h2 className="text-lg my-2">Size XS</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                size="xs"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*size sm*/}
            <div>
              <h2 className="text-lg my-2">Size SM</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                size="sm"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*size md*/}
            <div>
              <h2 className="text-lg my-2">Size MD</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                size="md"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*size lg*/}
            <div>
              <h2 className="text-lg my-2">Size LG</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                size="lg"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*icon left*/}
            <div>
              <h2 className="text-lg my-2">Icon left</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                isLoading={false}
                disabled={false}
                iconPosition="left"
                icon={<FontAwesomeIcon icon={faRadio} />}
              />
            </div>
            {/*icon right*/}
            <div>
              <h2 className="text-lg my-2">Icon Right</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                isLoading={false}
                disabled={false}
                iconPosition="right"
                icon={<FontAwesomeIcon icon={faReceipt} />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UiExamplesPage
