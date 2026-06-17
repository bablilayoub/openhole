class Openhole < Formula
  desc "Expose localhost to the internet with one command"
  homepage "https://openhole.dev"
  version "0.2.0"
  license "MIT"

  on_macos do
    on_intel do
      url "https://github.com/bablilayoub/openhole/releases/download/v#{version}/openhole-darwin-amd64"
      sha256 "REPLACE_ON_RELEASE"
    end
    on_arm do
      url "https://github.com/bablilayoub/openhole/releases/download/v#{version}/openhole-darwin-arm64"
      sha256 "REPLACE_ON_RELEASE"
    end
  end

  on_linux do
    on_intel do
      url "https://github.com/bablilayoub/openhole/releases/download/v#{version}/openhole-linux-amd64"
      sha256 "REPLACE_ON_RELEASE"
    end
    on_arm do
      url "https://github.com/bablilayoub/openhole/releases/download/v#{version}/openhole-linux-arm64"
      sha256 "REPLACE_ON_RELEASE"
    end
  end

  def install
    if OS.mac?
      arch = Hardware::CPU.arm? ? "arm64" : "amd64"
      bin.install "openhole-darwin-#{arch}" => "openhole"
    else
      arch = Hardware::CPU.arm? ? "arm64" : "amd64"
      bin.install "openhole-linux-#{arch}" => "openhole"
    end
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/openhole --version")
  end
end
