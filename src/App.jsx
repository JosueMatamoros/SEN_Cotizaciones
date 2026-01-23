import FormSection from "./section/form";
import PreviewSection from "./section/preview";
function App() {
  return (
    <div className="w-full flex lg:flex-col-reverse ">
      <PreviewSection />
      <FormSection />
    </div>
  );
}

export default App;
