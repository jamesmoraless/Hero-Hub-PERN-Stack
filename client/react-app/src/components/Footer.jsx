import React from 'react';
import './footer.css'; // Make sure to create and import your CSS file

export default function Footer() {
    return (
        <footer className="footer-container">
            <a href="/" className="footer-link">Home</a>
            <a href="/SecurityPrivay.html" className="footer-link">Security and Privacy Policy</a>
            <a href="/AUP.html" className="footer-link">AUP</a>
            <a href="/DMCA.html" className="footer-link">DMCA</a>
            <a href="/Workflow.html" className="footer-link">Workflow Document</a>
        </footer>
    );
}
