import FormSection from "./section/form";
import PreviewSection from "./section/preview";
function App() {
  return (
    <div className="w-full flex  flex-col-reverse  lg:flex-row ">
      <PreviewSection />
      <FormSection />
    </div>
  );
}

export default App;
