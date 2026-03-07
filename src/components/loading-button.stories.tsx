import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor } from "storybook/test";
import { LoadingButton } from "./loading-button";

const meta = {
  title: "Components/LoadingButton",
  component: LoadingButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    isLoading: {
      control: "boolean",
    },
    loadingText: {
      control: "text",
    },
  },
} satisfies Meta<typeof LoadingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
    isLoading: false,
  },
};

export const Click: Story = {
  args: {
    children: "Button",
  },
  play: async ({ canvas, args, userEvent }) => {
    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onClick).toHaveBeenCalled());
  },
};

export const Loading: Story = {
  args: {
    children: "Button",
    isLoading: true,
  },
};
