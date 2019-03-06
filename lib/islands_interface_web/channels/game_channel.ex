defmodule IslandsInterfaceWeb.GameChannel do
  use IslandsInterfaceWeb, :channel

  alias IslandsInterface.{Game, GameSupervisor}

  def join("game:" <> player, _payload, socket) do
    IO.puts "Joining the game channel"
    {:ok, socket}
  end

  def handle_in("hello", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

end
