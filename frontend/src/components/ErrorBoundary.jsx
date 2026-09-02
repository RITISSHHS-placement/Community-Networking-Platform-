import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this would report to a monitoring service.
    console.error('Unhandled runtime exception:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: '90px 32px', textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Something broke</div>
          <h2 style={{ fontSize: 26, margin: '14px 0 10px' }}>This page hit an unexpected error</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>
            Refresh the page, or head back home and try again.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.assign('/')}>
            Back to home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
