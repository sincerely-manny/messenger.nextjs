import './global.scss';
import fonts from 'scss/fonts';
import PopUpNotificationsProvider from 'components/PopUpNotifications';

const RootLayout = ({ children }: {
    children: React.ReactNode;
}) => (
    <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className={fonts.nunito.className}>
            {children}
            <PopUpNotificationsProvider />
        </body>
    </html>
);

export default RootLayout;
