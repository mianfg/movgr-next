export function UmamiAnalytics() {
  return (
    <script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={process.env.UMAMI_WEBSITE_ID}
    ></script>
  );
}
