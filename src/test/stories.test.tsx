import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";
import { composeStories, setProjectAnnotations } from "@storybook/react";
import { render } from "@testing-library/react";
import axe from "axe-core";
import previewAnnotations from "../../.storybook/preview";

// Storybook の preview.tsx（decorator・parameters）をテストにも適用する
setProjectAnnotations([previewAnnotations]);

type StoryModule = Parameters<typeof composeStories>[0];
type ComposedStory = ComponentType & {
  play?: (context: { canvasElement: HTMLElement }) => Promise<void>;
};

/**
 * 全ストーリーを描画し、play 関数の実行とアクセシビリティ検査を行う。
 * ストーリーを足すだけで、この 2 つが自動でかかる。
 */
const storyModules = import.meta.glob("../**/*.stories.tsx", { eager: true }) as Record<
  string,
  StoryModule
>;

for (const [path, storyModule] of Object.entries(storyModules)) {
  const composed = composeStories(storyModule) as Record<string, ComposedStory>;
  const fileName = path.split("/").pop();

  describe(`${fileName}`, () => {
    for (const [name, Story] of Object.entries(composed)) {
      it(`${name}: 描画・操作・アクセシビリティ`, async () => {
        const { container } = render(<Story />);

        // stories に play があれば実行する（インタラクションテスト）
        await Story.play?.({ canvasElement: container });

        const results = await axe.run(container, {
          // jsdom では実際の色を計算できないため、コントラストは Storybook の UI で確認する
          rules: { "color-contrast": { enabled: false } },
        });

        const violations = results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          nodes: violation.nodes.map((node) => node.html),
        }));

        expect(violations).toEqual([]);
      });
    }
  });
}
