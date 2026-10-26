// פרטי הקשר של החברה - לשנות כאן לפרטים האמיתיים
const CONTACT = {
    manager: "אנסבכר אילה",
    phone: "036196106",
    whatsapp: "0548434045", // מספר בפורמט בינלאומי: 972 ובלי ה-0 שבהתחלה
    email: "shosh81081@gmail.com",
    address: "בני ברק סימטת אפרים 3 ",
    hours: "א'-ה' 9:00-18:00"
};

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <h3>אירוע בטעם</h3>
                    <p>קייטרינג לאירועים ושמחות</p>
                </div>

                <div className="footer-contact">
                    <h4>צור קשר</h4>
                    <p>מנהל: {CONTACT.manager}</p>
                    <a className="contact-link icon-phone" href={`tel:${CONTACT.phone}`}>
                        {CONTACT.phone}
                    </a>
                    <a
                        className="contact-link icon-whatsapp"
                        href={`https://wa.me/${CONTACT.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        שליחת הודעה בוואטסאפ
                    </a>
                    <a className="contact-link icon-mail" href={`mailto:${CONTACT.email}`}>
                        {CONTACT.email}
                    </a>
                </div>

                <div className="footer-info">
                    <h4>פרטים</h4>
                    <p className="contact-link icon-map">{CONTACT.address}</p>
                    <p className="contact-link icon-clock">{CONTACT.hours}</p>
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} אירוע בטעם. כל הזכויות שמורות.
            </div>
        </footer>
    );
}