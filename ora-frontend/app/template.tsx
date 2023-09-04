import Header from "@/components/Header";

import "primereact/resources/themes/lara-light-indigo/theme.css";   
import "primereact/resources/primereact.min.css";

const Template = ({ children }: { children: React.ReactNode }) => {
    return <>
        <Header />
        <main>
            {children}
        </main>
    </>;
};

export default Template;
