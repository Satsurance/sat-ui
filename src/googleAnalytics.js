export default {
    install(app) {
        if (import.meta.env.PROD) {
            // Load Google Analytics only in production
            const script = document.createElement("script");
            script.async = true;
            script.src = "https://www.googletagmanager.com/gtag/js?id=G-05CPBM9ZZZ";
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "G-05CPBM9ZZZ");
        }
    }
}