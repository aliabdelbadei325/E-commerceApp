import StaticPageLayout from './StaticPageLayout';

const Terms = () => {
    return (
        <StaticPageLayout title="Terms of Service" subtitle="Please read these terms carefully">
            <p>
                Welcome to LuxeStore. By accessing or using our website, you agree to be bound by these Terms of Service.
            </p>

            <h2>Use of Service</h2>
            <p>
                You agree to use our website only for lawful purposes. You are prohibited from violating or attempting to violate the security of the site,
                including accessing data not intended for you or logging into a server or account which you are not authorized to access.
            </p>

            <h2>Product Information</h2>
            <p>
                We strive to be as accurate as possible with our product descriptions and pricing. However, we do not warrant that product descriptions
                or other content of this site is accurate, complete, reliable, current, or error-free.
            </p>

            <h2>Intellectual Property</h2>
            <p>
                All content included on this site, such as text, graphics, logos, images, and software, is the property of LuxeStore or its content suppliers
                and protected by international copyright laws.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
                LuxeStore shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability
                to use our services or for cost of procurement of substitute goods and services.
            </p>

            <h2>Changes to Terms</h2>
            <p>
                We reserve the right to update or modify these Terms of Service at any time without prior notice. Your continued use of the website
                following any changes constitutes your agreement to follow and be bound by the terms as changed.
            </p>
        </StaticPageLayout>
    );
};

export default Terms;
