import { useTranslation } from "react-i18next";
import cn from "classnames";
import { NavigationPropsI } from "./NavigationProps";
import styles from "./Navigation.module.scss";
import Link from "next/link";
import { useState } from "react";
export const Navigation: React.FC<NavigationPropsI> = ({ active }) => {
  const { t } = useTranslation();

  const [isBurgerActive, setBurgerState] = useState(false);

  return (
    <div className={styles.container}>
          <button onClick={() => setBurgerState(!isBurgerActive)}>
            <span></span>
          </button>
      <nav onClick={() => setBurgerState(false)} className={(styles.navigation) + ' ' + cn(isBurgerActive && (styles.open))}>
            <ul>
              <li
                className={cn(
                  active &&
                    (active === "games" ? styles.active : styles.inactive)
                )}
              >
                <Link href="/games">{t("navigation.gameDemo")}</Link>
              </li>
              <li
                className={cn(
                  active &&
                    (active === "documents" ? styles.active : styles.inactive)
                )}
              >
                <a
                  href="https://github.com/ChainHackers/GameJutsu#readme"
                  target="_blank"
                >
                  {t("navigation.documents")}
                </a>
              </li>
              <li
                className={cn(
                  active &&
                    (active === "team" ? styles.active : styles.inactive)
                )}
              >
                <Link href="/team">{t("navigation.team")}</Link>
              </li>
              <li
                style={{ position: "relative", top: "10px" }}
                className={cn(
                  active &&
                    (active === "documents" ? styles.active : styles.inactive)
                )}
              >
                <a href="https://discord.gg/a5E9vWbp9R">
                  <div className={styles.logo} style={{ top: "-2px" }}>
                    <svg viewBox="0 0 127.14 96.36">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                </a>
              </li>
              <li
                style={{ position: "relative", top: "2px" }}
                className={cn(
                  active &&
                    (active === "github" ? styles.active : styles.inactive)
                )}
              >
                <a href="https://github.com/chainHackers" target="_blank">
                  <div className={styles.logo} style={{ top: "3px" }}>
                    <svg version="1.1" viewBox="0 0 35 35">
                      <path d="M16.288,0 C7.294,0 0,7.293 0,16.29 C0,23.487 4.667,29.592 11.14,31.746 C11.955,31.896 12.252,31.393 12.252,30.961 C12.252,30.575 12.238,29.55 12.23,28.191 C7.699,29.175 6.743,26.007 6.743,26.007 C6.002,24.125 4.934,23.624 4.934,23.624 C3.455,22.614 5.046,22.634 5.046,22.634 C6.681,22.749 7.541,24.313 7.541,24.313 C8.994,26.802 11.354,26.083 12.282,25.666 C12.43,24.614 12.851,23.896 13.316,23.489 C9.699,23.078 5.896,21.68 5.896,15.438 C5.896,13.66 6.531,12.205 7.573,11.067 C7.405,10.655 6.846,8.998 7.733,6.756 C7.733,6.756 9.1,6.318 12.212,8.426 C13.511,8.064 14.905,7.884 16.29,7.877 C17.674,7.884 19.067,8.064 20.368,8.426 C23.478,6.318 24.843,6.756 24.843,6.756 C25.732,8.998 25.173,10.655 25.006,11.067 C26.05,12.205 26.68,13.66 26.68,15.438 C26.68,21.696 22.871,23.073 19.243,23.476 C19.827,23.979 20.348,24.973 20.348,26.493 C20.348,28.67 20.328,30.427 20.328,30.961 C20.328,31.397 20.622,31.904 21.448,31.745 C27.916,29.586 32.579,23.485 32.579,16.29 C32.579,7.293 25.285,0 16.288,0" />
                    </svg>
                  </div>
                </a>
              </li>
            </ul>
      </nav>
    </div>
  );
};
