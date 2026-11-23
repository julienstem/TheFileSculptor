import FileConverterManager from "../FileConverterManager/fileConverterManager";
import RenderList from "../RenderList/RenderList";

export default function Converter() {
  return (
    <div className="converter">
      <FileConverterManager />
      <RenderList />
    </div>
  );
}
