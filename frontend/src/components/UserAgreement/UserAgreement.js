import './UserAgreement.css';
import { Link } from 'react-router';

const UserAgreement = () => {
    return (
        <div className="user-agreement-container">
            <div className="user-agreement-wrapper">
                <div className="user-agreement-content">
                    <h2 className="header">User Agreement - Otaku Library</h2>
                    <div className="content-container">
                        <section>
                            <h3>Introduction</h3>
                            <div>
                                Welcome to Otaku Library! By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions (the "User Agreement"). If you do not agree to these terms, please do not use our services.
                            </div>
                        </section>
                        <section>
                            <h3>1. Account Registration</h3>
                            <div>
                                To use Otaku Library’s services, you may need to create an account. You are responsible for providing accurate and up-to-date information. Please keep your account credentials confidential. You agree to notify us immediately of any unauthorized use of your account.
                            </div>
                        </section>
                        <section>
                            <h3>2. Acceptable Use</h3>
                            <div>
                                You agree to use Otaku Library only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the service. Prohibited activities include, but are not limited to:
                            </div>
                            <ul>
                                <li>Uploading, posting, or transmitting any harmful or unlawful content.</li>
                                <li>Engaging in harassment, abuse, or discriminatory practices.</li>
                                <li>Violating any local, state, or national laws while using the platform.</li>
                            </ul>
                        </section>
                        <section>
                            <h3>3. Intellectual Property</h3>
                            <div>
                                All content on Otaku Library, including but not limited to text, graphics, logos, images, and software, is the property of Otaku Library and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, modify, distribute, or otherwise use any content from Otaku Library without permission.
                            </div>
                        </section>
                        <section>
                            <h3>4. User-Generated Content</h3>
                            <div>
                                Otaku Library may allow users to upload or share content. By submitting content, you grant Otaku Library a worldwide, royalty-free, non-exclusive license to use, display, and distribute your content as part of the service. You are solely responsible for the content you upload and agree not to post anything that violates the rights of others.
                            </div>
                        </section>
                        <section>
                            <h3>5. Termination of Account</h3>
                            <div>
                                We reserve the right to suspend or terminate your account at any time, with or without notice, if we believe that you have violated the terms of this User Agreement.
                            </div>
                        </section>
                        <section>
                            <h3>6. Limitation of Liability</h3>
                            <div>
                                Otaku Library is not liable for any direct, indirect, incidental, or consequential damages that may arise from your use of the platform. We do not guarantee that the service will be uninterrupted or error-free.
                            </div>
                        </section>
                        <section>
                            <h3>7. Changes to the Agreement</h3>
                            <div>
                                Otaku Library reserves the right to update or modify this User Agreement at any time. We will notify users of significant changes through the platform or by email. Continued use of the service after changes are made constitutes acceptance of the new terms.
                            </div>
                        </section>
                        <section>
                            <h3>8. Governing Law</h3>
                            <div>
                                This Agreement shall be governed by and construed in accordance with the laws of [Your Country or State], without regard to its conflict of law principles.
                            </div>
                        </section>
                        <section>
                            <h3>Contact Information</h3>
                            <div>
                                For any questions or concerns about this User Agreement, please contact us at <strong>support@otakulibrary.com</strong>.
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

export default UserAgreement;