import './UserPrivacyNotice.css';
import { Link } from 'react-router';

const UserPrivacyNotice = () => {
    return (
        <div className="user-privacy-notice-container">
            <div className="user-privacy-notice-wrapper">
                <div className="user-privacy-notice-content">
                    <h2 className="header">User Privacy Notice - Otaku Library</h2>
                    <div className="content-container">
                        <section>
                            <h3>Introduction</h3>
                            <div>
                                At Otaku Library, we value your privacy. This Privacy Notice explains how we collect, use, store, and protect your personal information when you use our services. By using Otaku Library, you agree to the collection and use of your data in accordance with this notice.
                            </div>
                        </section>
                        <section>
                            <h3>1. Information We Collect</h3>
                            <div>
                                We collect the following types of personal information:
                            </div>
                            <ul>
                                <li><strong>Account Information</strong>: Name, email address, and password when you register.</li>
                                <li><strong>Usage Data</strong>: Information on how you use the platform, including IP addresses, browser types, and pages viewed.</li>
                                <li><strong>Content</strong>: User-generated content that you upload or share on the platform.</li>
                            </ul>
                        </section>
                        <section>
                            <h3>2. How We Use Your Information</h3>
                            <div>
                                We use your personal information for the following purposes:
                            </div>
                            <ul>
                                <li>To provide and maintain the service.</li>
                                <li>To personalize your experience and suggest content based on your preferences.</li>
                                <li>To communicate with you about updates, promotions, and other relevant information.</li>
                                <li>To ensure the security and integrity of our platform.</li>
                            </ul>
                        </section>
                        <section>
                            <h3>3. Sharing Your Information</h3>
                            <div>
                                We do not share your personal information with third parties except in the following cases:
                            </div>
                            <ul>
                                <li>With service providers that help us run the platform (e.g., hosting services, email providers).</li>
                                <li>If required by law, to comply with legal obligations, or to protect our rights.</li>
                                <li>In the event of a business transfer (e.g., merger, acquisition), your information may be transferred.</li>
                            </ul>
                        </section>
                        <section>
                            <h3>4. Cookies and Tracking Technologies</h3>
                            <div>
                                We use cookies and similar technologies to improve your experience on Otaku Library. Cookies help us track your preferences and enhance the functionality of our platform. You can manage or disable cookies through your browser settings.
                            </div>
                        </section>
                        <section>
                            <h3>5. Data Security</h3>
                            <div>
                                We take reasonable steps to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no data transmission over the internet can be guaranteed as 100% secure.
                            </div>
                        </section>
                        <section>
                            <h3>6. Your Rights</h3>
                            <div>
                                You have the right to:
                            </div>
                            <ul>
                                <li>Access the personal information we hold about you.</li>
                                <li>Request that we correct or delete your personal information.</li>
                                <li>Withdraw your consent for us to process your data (where applicable).</li>
                                <li>Object to or restrict certain types of data processing.</li>
                            </ul>
                            <div>
                                To exercise any of these rights, please contact us at <strong>support@otakulibrary.com</strong>.
                            </div>
                        </section>
                        <section>
                            <h3>7. Retention of Data</h3>
                            <div>
                                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Notice or as required by law.
                            </div>
                        </section>
                        <section>
                            <h3>8. Children’s Privacy</h3>
                            <div>
                                Otaku Library is not intended for children under the age of 13. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under the age of 13, we will take steps to delete that information.
                            </div>
                        </section>
                        <section>
                            <h3>9. Changes to This Privacy Notice</h3>
                            <div>
                                We may update this Privacy Notice from time to time. We will notify users of any significant changes, and the updated notice will be posted on our website. Your continued use of Otaku Library after such changes constitutes acceptance of the revised notice.
                            </div>
                        </section>
                        <section>
                            <h3>Contact Information</h3>
                            <div>
                                If you have any questions or concerns about this Privacy Notice, please contact us at <strong>support@otakulibrary.com</strong>.
                            </div>
                        </section>
                    </div>
                    <div className="return-button">
                        <Link to="/registration" className="link-to-registration link">
                            <div className="return btn">Go back to registration</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPrivacyNotice;