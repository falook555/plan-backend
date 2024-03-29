import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <title>แผนปฏิบัติงาน</title>
                <link rel="shortcut icon" href="static/dist/img/logo.jpg" />
                <Head>
                    <div>
                        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200&display=swap" rel="stylesheet" />
                        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" rel="stylesheet" />
                        <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />
                        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />

                        <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
                        <link rel="stylesheet" href="static/plugins/fontawesome-free/css/all.min.css" />
                        <link rel="stylesheet" href="static/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css" />
                        <link rel="stylesheet" href="static/plugins/icheck-bootstrap/icheck-bootstrap.min.css" />
                        <link rel="stylesheet" href="static/dist/css/adminlte.min.css" />
                        <link rel="stylesheet" href="static/plugins/overlayScrollbars/css/OverlayScrollbars.min.css" />
                        <link rel="stylesheet" href="static/plugins/pace-progress/themes/blue/pace-theme-flat-top.css" />
                    </div>


                </Head>
                <body style={{ fontFamily: 'Kanit' }} className="hold-transition sidebar-mini layout-fixed">
                    <div className="wrapper">
                        <Main />
                        <NextScript />
                    </div>
                    <script defer src="static/plugins/jquery/jquery.min.js"></script>
                    <script defer src="static/plugins/jquery-ui/jquery-ui.min.js"></script>
                    <script defer src="static/dist/js/adminlte.js"></script>
                    <script defer src="static/dist/js/thaibath.js"></script>
                    <script defer src="static/plugins/pace-progress/pace.min.js" />
                </body>
            </Html>
        )
    }
}

export default MyDocument