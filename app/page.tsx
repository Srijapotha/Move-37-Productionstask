import Editor from '@/components/editor/Editor';
import { StoreProvider } from '@/lib/redux/provider';

export default function Home() {
  return (
    <main>
      <StoreProvider>
        <Editor />
      </StoreProvider>
    </main>
  );
}