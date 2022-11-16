import './global.scss';
import fonts from 'scss/fonts';
import PopUpNotificationsProvider from 'components/PopUpNotifications/PopUpNotificationsProvider';

export default function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
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
}
