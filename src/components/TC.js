 import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Importing back arrow icon
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook for navigation


 const locations = [
        'Nettukuppam',
        'Ennore Kuppam',
        'Thazhankuppam',
        'Mugathuvara Kuppam',
        'Ulagnathapuram',
        'SVM Nagar',
        'Vallur Nagar',
        'Kamaraj Nagar',
        'High School Surroundings',
        'Kaathukuppam',
        'RS Road',
        'Ennore Bus Depot Surroundings',
    ];
const TC = () => {
    const navigate = useNavigate(); // Initialize the navigate function

    return (
        <Box sx={{p:4}}>
         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' ,mt:1,p:2}}>
    <IconButton 
        onClick={() => navigate(-1)} // Navigate one step back when clicked
        sx={{ position: 'absolute', left: 16, zIndex: 1, p: 0 }}
    >
        <ArrowBackIcon />
    </IconButton>
   <Typography variant="h6" align="center" sx={{ flexGrow: 1 }}>
          Terms & Conditions
        </Typography>
      </Box>

      {/* Terms & Conditions Content */}
      <Typography variant="body1" paragraph sx={{ paddingBottom: 2 }}>
        Welcome to <strong>Ennore Delivery</strong>! By using our services, you agree to the following terms and conditions. Please read them carefully. Your use of the Platform indicates your acceptance of these Terms. If you have any questions about the Terms, feel free to contact us before using the service.
      </Typography>

      {/* 1. General Terms of Use */}
      <Typography variant="h5" gutterBottom>
        1. General Terms of Use
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Acceptance of Terms:</strong> By accessing or using Ennore Delivery’s platform, services, or any related content, you agree to comply with and be bound by these Terms of Use, including any updates or changes made hereafter. If you do not agree to these Terms, please refrain from using our services. The continued use of our services after any changes to the Terms constitutes your acceptance of those changes.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Modification of Terms:</strong> Ennore Delivery reserves the right to modify, update, or revise these Terms at any time without prior notice. All such changes will be posted on this page. Your continued use of the Platform after such changes will be deemed as your acceptance of the new Terms. It is your responsibility to review these Terms periodically for any updates.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>User Responsibilities:</strong> As a user, you are responsible for maintaining the confidentiality of your account details, including your login credentials. You agree to provide accurate, current, and complete information during registration and to update that information as necessary. You are responsible for safeguarding your account and notifying us immediately of any unauthorized access or use. You must also ensure that your activities comply with all applicable local, state, and international laws.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Unauthorized Use:</strong> Any attempt to harm, misuse, or disrupt the operation of the Platform or engage in fraudulent activity is strictly prohibited. This includes, but is not limited to, using our Platform to conduct illegal activities, sending spam, or attempting to gain unauthorized access to other users' accounts, data, or systems.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Intellectual Property:</strong> All content, features, and functionalities of the Platform, including but not limited to text, graphics, logos, images, data, design, and software, are owned by Ennore Delivery or licensed to us. They are protected by intellectual property laws, including copyright, trademark, and patent laws. You agree not to copy, modify, distribute, or otherwise use any of the content for any commercial purpose without prior written permission from Ennore Delivery.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Third-Party Links:</strong> The Platform may contain links to third-party websites or services that are not owned or controlled by Ennore Delivery. We are not responsible for the content, privacy policies, or practices of any third-party sites. You access these sites at your own risk, and we advise you to review their terms of service and privacy policies before engaging with them.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Indemnification:</strong> You agree to indemnify, defend, and hold harmless Ennore Delivery, its affiliates, employees, contractors, and agents from any claims, liabilities, damages, losses, or expenses (including legal fees) arising from your use of the Platform or your violation of these Terms.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Governing Law & Jurisdiction:</strong> These Terms are governed by the laws of India. Any disputes arising out of or in connection with these Terms shall be resolved under the exclusive jurisdiction of the courts in New Delhi, India. You agree to submit to the personal jurisdiction of the courts in New Delhi for any legal proceedings arising from these Terms.
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />

      {/* 2. Shipping Policy */}
      <Typography variant="h5" gutterBottom>
        2. Shipping Policy
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Scope and Timeframe:</strong> Ennore Delivery offers prompt delivery services across specified regions, with an estimated delivery time ranging from 45 minutes to 2 hours, depending on location, traffic conditions, and order volume. While we strive to meet delivery timeframes, please be aware that delays may occur under certain circumstances.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Possible Delays:</strong> While we aim for timely deliveries, occasional delays may occur due to unforeseen circumstances such as weather conditions, traffic jams, or technical issues. We will notify you of significant delays, but we encourage you to plan ahead and be patient in such cases.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Delivery Locations:</strong> We currently deliver to the following locations, and we may expand or modify the list of delivery areas at our discretion:
      </Typography>
      <ul>
        {[
          'Nettukuppam', 'Ennore Kuppam', 'Thazhankuppam', 'Mugathuvara Kuppam', 'Ulagnathapuram', 
          'SVM Nagar', 'Vallur Nagar', 'Kamaraj Nagar', 'High School Surroundings', 'Kaathukuppam', 
          'RS Road', 'Ennore Bus Depot Surroundings'
        ].map((location, index) => (
          <li key={index}>{location}</li>
        ))}
      </ul>
      <Typography variant="body1" paragraph>
        If your location is outside our current service areas, please contact us via email to inquire about availability.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Contact Us:</strong> If you have any inquiries or updates regarding your order, please reach us via email at: 
        <a href="mailto:ennore-delivery@gmail.com">ennore.delivery@gmail.com</a>
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />

      {/* 3. Refund & Cancellation Policy */}
      <Typography variant="h5" gutterBottom>
        3. Refund & Cancellation Policy
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Strictly No Return or Refund Policy:</strong> Due to the nature of our services , all sales made via the Ennore Delivery platform are final. Once an order is placed, we cannot accept returns or offer refunds.
      </Typography>
      
      <Divider sx={{ marginBottom: 2 }} />

      {/* 4. Privacy Policy */}
      <Typography variant="h5" gutterBottom>
    4. Privacy Policy
</Typography>
<Typography variant="body1" paragraph>
    This Privacy Policy outlines how Ennore Delivery collects, uses, shares, and protects your personal information. By using our platform, you agree to the terms set forth in this Privacy Policy and the applicable terms and conditions of our services. Your privacy is important to us, and we are committed to ensuring the confidentiality and security of your personal information.
</Typography>
<Typography variant="body1" paragraph>
    <strong>Collection of Personal Data:</strong> We collect personal data to provide and enhance our services. This includes, but is not limited to:
</Typography>
<Typography variant="body1" component="ul">
    <li><strong>Identity Information:</strong> Your name, address, and phone number.</li>
    <li><strong>Contact Information:</strong> Your email address for communication purposes.</li>
    <li><strong>Payment Information:</strong> Credit/debit card details and other payment methods for transaction processing.</li>
    <li><strong>Transactional Data:</strong> Details of your orders, preferences, and interactions on the platform.</li>
    <li><strong>Device Data:</strong> Information like IP address, browser type, and device details for better user experience and security.</li>
</Typography>
<Typography variant="body1" paragraph>
    We collect this data directly from you or through automated methods when you use our platform.
</Typography>
<Typography variant="body1" paragraph>
    <strong>Usage of Personal Data:</strong> The information we collect is used to:
</Typography>
<Typography variant="body1" component="ul">
    <li>Provide and deliver our services efficiently, including order fulfillment and customer support.</li>
    <li>Personalize your experience by offering tailored recommendations.</li>
    <li>Notify you of service updates, promotions, and other relevant communications.</li>
    <li>Process payments securely and detect fraudulent activities.</li>
    <li>Enhance our platform’s functionality through analytics and user feedback.</li>
</Typography>
<Typography variant="body1" paragraph>
    <strong>Sharing of Personal Data:</strong> We may share your personal information with:
</Typography>
<Typography variant="body1" component="ul">
    <li><strong>Affiliates:</strong> To offer seamless services across our network.</li>
    <li><strong>Partner Stores:</strong> To process and fulfill your orders.</li>
    <li><strong>Service Providers:</strong> Such as payment gateways, delivery partners, and analytics tools to support our operations.</li>
    <li><strong>Legal Authorities:</strong> When required to comply with legal obligations or in response to lawful requests.</li>
</Typography>
<Typography variant="body1" paragraph>
    Rest assured, we do not sell or rent your personal information to third parties for marketing purposes.
</Typography>
<Typography variant="body1" paragraph>
    <strong>Security Precautions:</strong> We implement industry-standard security measures to protect your personal data from unauthorized access, loss, or misuse. These include encryption, secure servers, and regular audits. However, we encourage users to safeguard their login credentials and report any suspicious activity promptly.
</Typography>
<Typography variant="body1" paragraph>
    <strong>Data Retention and Deletion:</strong> We retain your data only as long as necessary to fulfill the purposes outlined in this policy or as required by law. You may delete your account at any time through the platform. Note that certain data may be retained to resolve disputes, enforce agreements, or comply with legal obligations.
</Typography>
<Typography variant="body1" paragraph>
    <strong>Your Rights:</strong> As a user, you have the right to:
</Typography>
<Typography variant="body1" component="ul">
    <li>Access and review the personal data we hold about you.</li>
    <li>Update or correct your information for accuracy.</li>
    <li>Request the deletion of your data, subject to certain limitations outlined above.</li>
    <li>Opt out of marketing communications at any time.</li>
</Typography>
<Typography variant="body1" paragraph>
    For any privacy-related concerns or requests, you may contact us through the support section of our platform or email us at <strong>support@ennoredelivery.com</strong>.
</Typography>
<Typography variant="body1" paragraph>
    <strong>Changes to this Privacy Policy:</strong> We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Users will be notified of significant changes via the platform or email. Your continued use of the platform following such updates constitutes your acceptance of the revised policy.
</Typography>
<Typography variant="body1" paragraph>
    Thank you for trusting Ennore Delivery with your personal information. We value your privacy and strive to keep your data safe while offering a reliable and enjoyable service experience.
</Typography>
      <Divider sx={{ marginBottom: 2 }} />

      {/* 5. Terms of Service */}
                <Typography variant="h5" gutterBottom>
                    5. Terms of Service
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Service Scope:</strong> Ennore Delivery provides a platform to browse and purchase goods with delivery services in the location mentioned.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Prohibited Activities:</strong> You agree not to use the platform for unlawful activities.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Limitation of Liability:</strong> Ennore Delivery is not liable for any indirect or consequential damages from the use of the platform.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Changes to Services:</strong> We may alter or discontinue services at any time without notice.
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

                {/* 6. Disclaimer */}
                <Typography variant="h5" gutterBottom>
                    6. Disclaimer
                </Typography>
                <Typography variant="body1" paragraph>
                    The Platform is provided "as is." Ennore Delivery disclaims all warranties regarding the accuracy, reliability, or completeness of the Platform's content.
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

                {/* 7. Force Majeure */}
                <Typography variant="h5" gutterBottom>
                    7. Force Majeure
                </Typography>
                <Typography variant="body1" paragraph>
                    Ennore Delivery is not liable for any failure to perform its obligations if hindered by events beyond our control, like natural disasters or technical issues.
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />


                {/* Footer */}
                <Box textAlign="center" mt={4}>
                    <Typography variant="body2" color="textSecondary">
                        By using the Ennore Delivery app, you acknowledge and agree to these terms. We are committed to providing quality delivery services to meet your needs and expectations.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" mt={1}>
                        Thank you for choosing Ennore Delivery!
                                            </Typography> 
                        <Typography variant="body2" color="textSecondary" mt={1}>

                        contact us : ennore.delivery@gmail.com
                    </Typography> 
                </Box>

<Box> {/* Divider */} 
<Divider /> 
</Box>

        </Box>
    );
};

export default TC;
