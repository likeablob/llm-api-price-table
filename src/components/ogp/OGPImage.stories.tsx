import type { Meta, StoryObj } from "@storybook/react-vite";
import OGPImage from "./OGPImage";

const meta = {
  title: "Components/OGPImage",
  component: OGPImage,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "Tomato",
    siteName: "Vegetable Garden",
  },
  argTypes: {
    title: {
      control: "text",
    },
    siteName: {
      control: "text",
    },
  },
} satisfies Meta<typeof OGPImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLongTitle: Story = {
  args: {
    title: "Carrot - Sweet Orange Root Vegetable",
    siteName: "Vegetable Garden",
  },
};

export const WithLongSiteName: Story = {
  args: {
    title: "Tomato",
    siteName: "Organic Vegetable Farm - Fresh Produce",
  },
};
