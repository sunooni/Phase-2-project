import React from "react";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return <div>{t("footer.copyright", { year: 2025 })}</div>;
}

export default Footer;
