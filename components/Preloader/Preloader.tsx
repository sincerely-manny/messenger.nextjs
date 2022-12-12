import './Preloader.scss';

const Preloader = () => (
    <main className="preloader">
        <svg
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="300px"
            height="300px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 100 100"
            xmlSpace="preserve"
        >

            <path opacity=".75" fill="#F15A29" d="M90.39,52.75C89.4,73.64,72.65,90.39,51.76,91.38v-4.76c18.27-0.97,32.9-15.6,33.87-33.87H90.39z">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </path>
            <path opacity=".75" fill="#F7931D" d="M47.87,10.24V15c-18.26,0.97-32.89,15.6-33.86,33.86H9.25C10.24,27.98,26.99,11.23,47.87,10.24z">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </path>
            <path opacity=".75" fill="#27AAE1" d="M90.39,48.86h-4.76C84.66,30.6,70.02,15.97,51.76,15v-4.76C72.64,11.23,89.4,27.98,90.39,48.86z">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </path>
            <path opacity=".75" fill="#F7931D" d="M80.69,52.75C79.73,68.29,67.3,80.72,51.76,81.68v-4.47c13.07-0.94,23.52-11.38,24.46-24.46H80.69z">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </path>
            <path opacity=".75" fill="#00AEEF" d="M47.87,77.21v4.47c-15.53-0.97-27.96-13.4-28.92-28.93h4.46C24.35,65.83,34.79,76.27,47.87,77.21z">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="2s"
                    repeatCount="indefinite"
                />
            </path>
            <path opacity=".75" fill="#EF4136" d="M47.87,19.94v4.47c-13.08,0.94-23.52,11.37-24.46,24.45h-4.46C19.92,33.33,32.34,20.91,47.87,19.94z">
                <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 50 50"
                    to="360 50 50"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    </main>
);

export default Preloader;
