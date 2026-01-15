"use client";

import React from "react";

export class UiErrorBoundary extends React.Component<
  { children: React.ReactNode; label?: string },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error(`[${this.props.label ?? "UI"}] crashed:`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mt-4 p-3 border border-red-500 text-red-400 text-xs whitespace-pre-wrap">
          {this.props.label ?? "UI"} crashed:
          {"\n\n"}
          {this.state.error.message}
          {"\n\n"}
          {this.state.error.stack}
        </div>
      );
    }
    return this.props.children;
  }
}
