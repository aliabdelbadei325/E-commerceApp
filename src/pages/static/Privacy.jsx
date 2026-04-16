import StaticPageLayout from './StaticPageLayout';

const Privacy = () => {
    return (
        <StaticPageLayout title="Privacy Policy" subtitle="Last updated: January 2024">
            <p>
                At LuxeStore, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information.
            </p>

            <h2>Information We Collect</h2>
            <p>
                We collect information that you provide directly to us, such as when you create an account, make a purchase, or sign up for our newsletter.
                This may include your name, email address, shipping address, and payment information.
            </p>

            <h2>How We Use Your Information</h2>
            <ul>
                <li>To process and fulfill your orders.</li>
                <li>To communicate with you about your account or transactions.</li>
                <li>To send you marketing communications (if you have opted in).</li>
                <li>To improve our website and customer experience.</li>
            </ul>

            <h2>Data Security</h2>
            <p>
                We implement a variety of security measures to maintain the safety of your personal information. Your payment information is processed
                securely and is never stored on our servers.
            </p>

            <h2>Cookies</h2>
            <p>
                We use cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings,
                but this may affect the functionality of our website.
            </p>
        </StaticPageLayout>
    );
};

export default Privacy;
