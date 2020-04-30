declare const engineFactory: (templateRoot: string) => <P extends {}>(templateName: string, props: P) => string;
export default engineFactory;
