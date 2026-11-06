import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

type ContainerSize = "default" | "content";

type SizedContainerProps = ContainerProps & {
  size?: ContainerSize;
};

const sizeClasses: Record<ContainerSize, string> = {
  default: "max-w-360 px-5 sm:px-8 lg:px-10",
  content: "max-w-310 px-5 sm:px-6",
};

export function Container({
  className,
  size = "default",
  ...props
}: SizedContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${sizeClasses[size]} ${className ?? ""}`}
      {...props}
    />
  );
}
