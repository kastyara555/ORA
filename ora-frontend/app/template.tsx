import Header from "@/components/Header";

const Template = ({ children }: { children: React.ReactNode }) => {
    return <>
        <Header />
        <main>
            {children}
        </main>
    </>;
};

export default Template;
